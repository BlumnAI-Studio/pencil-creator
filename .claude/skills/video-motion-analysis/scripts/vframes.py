#!/usr/bin/env python3
"""
vframes.py — 영상 동작 분석용 프레임 추출 / 콘택트 시트 생성 도구.

방금 검증된 파이프라인을 그대로 캡슐화한다:
  1) prepare : YouTube URL이면 yt-dlp로 받고, 로컬 파일이면 그대로 사용.
               ffprobe로 길이/해상도/fps를 읽어 meta.json + 콘솔 요약 출력.
  2) montage : 지정 구간을 일정 간격으로 추출해 타임스탬프가 박힌
               타일 콘택트 시트(.png) 한 장으로 합친다.
  3) overview: 영상 전체를 grid 칸 수에 맞춰 자동 간격으로 montage.

도구(ffmpeg/ffprobe/yt-dlp)는 PATH → winget 기본 경로 → `python -m` 순으로 탐색한다.
drawtext 폰트도 OS별 일반 경로에서 자동 탐색하므로 별도 설정이 필요 없다.

사용 예:
  python vframes.py prepare --source "https://youtu.be/XXXX" --outdir out
  python vframes.py overview --video out/video.webm --outdir out --grid 6x8
  python vframes.py montage  --video out/video.webm --outdir out \
         --start 47 --end 56 --step 0.5 --grid 5x6 --name fine_47-56
"""
import argparse
import glob
import json
import os
import shutil
import subprocess
import sys

# Windows 콘솔(cp949 등)에서도 한글/기호가 깨지거나 크래시하지 않도록 UTF-8 고정.
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass


# ---------------------------------------------------------------- tool lookup
WINGET_FFMPEG = os.path.expandvars(
    r"%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin"
)


def _find_exe(name, extra_dirs=()):
    """PATH 우선, 없으면 알려진 디렉토리에서 실행 파일을 찾는다."""
    hit = shutil.which(name)
    if hit:
        return hit
    exts = (".exe", "") if os.name == "nt" else ("",)
    for d in extra_dirs:
        for ext in exts:
            cand = os.path.join(d, name + ext)
            if os.path.isfile(cand):
                return cand
    return None


def ffmpeg_bin():
    exe = _find_exe("ffmpeg", [WINGET_FFMPEG])
    if not exe:
        sys.exit("ffmpeg를 찾을 수 없습니다. 설치 후 PATH에 추가하세요.")
    return exe


def ffprobe_bin():
    exe = _find_exe("ffprobe", [WINGET_FFMPEG])
    if not exe:
        sys.exit("ffprobe를 찾을 수 없습니다. ffmpeg와 함께 설치됩니다.")
    return exe


def ytdlp_cmd():
    """yt-dlp 실행 커맨드(list) 반환. PATH → pip Scripts → python -m yt_dlp."""
    exe = _find_exe("yt-dlp")
    if exe:
        return [exe]
    # pip --user 설치 위치(Windows) 추정
    patterns = [
        os.path.expandvars(r"%LOCALAPPDATA%\Python\*\Scripts\yt-dlp.exe"),
        os.path.expandvars(r"%APPDATA%\Python\*\Scripts\yt-dlp.exe"),
    ]
    for pat in patterns:
        for cand in glob.glob(pat):
            return [cand]
    # 모듈로 폴백
    return [sys.executable, "-m", "yt_dlp"]


# ---------------------------------------------------------------- font lookup
FONT_CANDIDATES = [
    r"C:\Windows\Fonts\arial.ttf",
    r"C:\Windows\Fonts\segoeui.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/Library/Fonts/Arial.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
]


def font_for_drawtext():
    """drawtext용 폰트 경로를 ffmpeg 필터 문법에 맞게 이스케이프해 반환."""
    for p in FONT_CANDIDATES:
        if os.path.isfile(p):
            # ffmpeg 필터에서 드라이브 콜론은 \\: 로 이스케이프, 슬래시는 / 사용
            return p.replace("\\", "/").replace(":", "\\:")
    return None  # 폰트 없으면 타임스탬프 생략


# ---------------------------------------------------------------- subprocess
def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8",
                          errors="replace", **kw)


# ---------------------------------------------------------------- prepare
def cmd_prepare(args):
    os.makedirs(args.outdir, exist_ok=True)
    src = args.source

    if src.startswith("http://") or src.startswith("https://"):
        out_tmpl = os.path.join(args.outdir, "video.%(ext)s")
        fmt = (f"bestvideo[height<={args.height}]+bestaudio/"
               f"best[height<={args.height}]/best")
        cmd = ytdlp_cmd() + ["--no-warnings", "-f", fmt, "-o", out_tmpl, src]
        print(f"[prepare] downloading (<= {args.height}p) ...")
        r = run(cmd)
        if r.returncode != 0:
            print(r.stdout[-2000:]); print(r.stderr[-2000:])
            sys.exit("yt-dlp 다운로드 실패. yt-dlp 설치 여부를 확인하세요 "
                     "(pip install -U yt-dlp).")
        vids = sorted(glob.glob(os.path.join(args.outdir, "video.*")),
                      key=os.path.getmtime)
        vids = [v for v in vids if not v.endswith(".json")]
        if not vids:
            sys.exit("다운로드된 파일을 찾지 못했습니다.")
        video = vids[-1]
    else:
        if not os.path.isfile(src):
            sys.exit(f"로컬 파일을 찾을 수 없습니다: {src}")
        video = src

    meta = probe(video)
    meta["video"] = os.path.abspath(video)
    with open(os.path.join(args.outdir, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    print(f"[prepare] video   : {meta['video']}")
    print(f"[prepare] duration: {meta['duration']:.1f}s  "
          f"({int(meta['duration'] // 60)}m {int(meta['duration'] % 60)}s)")
    print(f"[prepare] size/fps: {meta['width']}x{meta['height']} @ {meta['fps']:.2f}fps")
    print(f"[prepare] meta.json 저장 완료. 다음: overview 또는 montage 실행.")


def probe(video):
    fp = ffprobe_bin()
    r = run([fp, "-v", "error", "-select_streams", "v:0",
             "-show_entries", "stream=width,height,r_frame_rate:format=duration",
             "-of", "json", video])
    data = json.loads(r.stdout or "{}")
    st = (data.get("streams") or [{}])[0]
    num, _, den = (st.get("r_frame_rate") or "0/1").partition("/")
    fps = float(num) / float(den) if float(den or 0) else 0.0
    dur = float((data.get("format") or {}).get("duration") or 0)
    return {"width": st.get("width"), "height": st.get("height"),
            "fps": fps, "duration": dur}


# ---------------------------------------------------------------- montage core
def build_montage(video, outdir, start, end, step, cols, rows, tile_w, name):
    os.makedirs(outdir, exist_ok=True)
    ff = ffmpeg_bin()
    fps = 1.0 / step  # step초마다 한 프레임 → fps
    font = font_for_drawtext()

    label = ""
    if font:
        # 각 프레임 좌상단에 실제 타임코드(HH:MM:SS.mmm) 표기. start만큼 오프셋.
        label = (f",drawtext=fontfile='{font}':text='%{{pts\\:hms\\:{start}}}':"
                 f"x=6:y=6:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6")

    vf = (f"fps={fps:.6f},scale={tile_w}:-1{label},"
          f"tile={cols}x{rows}:padding=3:margin=3")
    out = os.path.join(outdir, f"{name}.png")
    cmd = [ff, "-y", "-ss", str(start), "-to", str(end), "-i", video,
           "-vf", vf, "-frames:v", "1", out]
    r = run(cmd)
    if r.returncode != 0 or not os.path.isfile(out):
        print(r.stderr[-2000:])
        sys.exit("montage 생성 실패.")
    capacity = cols * rows
    n_frames = int((end - start) / step) + 1
    note = ""
    if n_frames > capacity:
        note = (f"  [!] 구간 프레임 {n_frames}개 > 그리드 용량 {capacity}개 "
                f"— 일부만 표시됨. grid를 키우거나 구간/step 조정 권장.")
    print(f"[montage] {out}")
    print(f"[montage] 구간 {start}-{end}s, step {step}s, grid {cols}x{rows}{note}")
    return out


def cmd_montage(args):
    cols, rows = parse_grid(args.grid)
    build_montage(args.video, args.outdir, args.start, args.end, args.step,
                  cols, rows, args.width, args.name)


def cmd_overview(args):
    cols, rows = parse_grid(args.grid)
    meta_path = os.path.join(args.outdir, "meta.json")
    if os.path.isfile(meta_path):
        dur = json.load(open(meta_path, encoding="utf-8"))["duration"]
    else:
        dur = probe(args.video)["duration"]
    capacity = cols * rows
    step = max(1.0, round(dur / capacity, 2))  # 전체를 칸 수에 맞춰 균등 분할
    build_montage(args.video, args.outdir, 0, dur, step, cols, rows,
                  args.width, args.name)
    print(f"[overview] 전체 {dur:.0f}s를 {capacity}칸에 ~{step}s 간격으로 배치.")


def parse_grid(g):
    try:
        c, r = g.lower().split("x")
        return int(c), int(r)
    except Exception:
        sys.exit("--grid 형식은 'colsxrows' 입니다. 예: 6x8")


# ---------------------------------------------------------------- cli
def main():
    p = argparse.ArgumentParser(description="영상 동작 분석용 프레임/콘택트 시트 도구")
    sub = p.add_subparsers(dest="cmd", required=True)

    pp = sub.add_parser("prepare", help="URL 다운로드 또는 로컬 확인 + 메타 추출")
    pp.add_argument("--source", required=True, help="YouTube URL 또는 로컬 영상 경로")
    pp.add_argument("--outdir", required=True)
    pp.add_argument("--height", type=int, default=480, help="최대 다운로드 해상도(기본 480)")
    pp.set_defaults(func=cmd_prepare)

    po = sub.add_parser("overview", help="전체 영상 자동 간격 콘택트 시트")
    po.add_argument("--video", required=True)
    po.add_argument("--outdir", required=True)
    po.add_argument("--grid", default="6x8")
    po.add_argument("--width", type=int, default=360, help="타일 한 칸 가로 px")
    po.add_argument("--name", default="overview")
    po.set_defaults(func=cmd_overview)

    pm = sub.add_parser("montage", help="지정 구간 콘택트 시트")
    pm.add_argument("--video", required=True)
    pm.add_argument("--outdir", required=True)
    pm.add_argument("--start", type=float, required=True)
    pm.add_argument("--end", type=float, required=True)
    pm.add_argument("--step", type=float, required=True, help="프레임 간격(초)")
    pm.add_argument("--grid", default="5x6")
    pm.add_argument("--width", type=int, default=400, help="타일 한 칸 가로 px")
    pm.add_argument("--name", required=True, help="출력 파일명(확장자 제외)")
    pm.set_defaults(func=cmd_montage)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
