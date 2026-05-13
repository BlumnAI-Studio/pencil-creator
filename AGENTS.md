# AGENTS.md

This file helps Codex work compatibly with the Claude Code-first workflow used in this repository. The main design workflows and slash-command skills usually run in Claude Code, but this repository is also used from Codex occasionally; when using Codex, treat the Claude skills under `.claude/skills/` as the primary compatibility reference.

## Project Overview

Pencil Creator is an **animation-first design project** driven primarily by Claude Code + Pencil MCP, with Codex support for compatible execution. The core workflow: research WPF animations → visualize in Pencil (.pen) → implement as HTML/CSS/JS. There is no traditional build system — all work is orchestrated through MCP servers, Claude-compatible skills, helper scripts, and a gamified evaluation harness.

## MCP Servers

- **Pencil MCP**: Read/write .pen files via `batch_get`, `batch_design`, `get_screenshot`, etc. `.pen` files are encrypted — **never use Read/Grep on .pen files**, always use Pencil MCP tools.
- **Playwright MCP**: Browser automation for HTML screenshot capture (optional).

## Skills (Slash Commands)

The slash commands below are Claude Code skills first. Codex should use this `AGENTS.md` as a bridge: before answering capability questions or executing a design workflow, check `.claude/skills/` and use the matching `SKILL.md` as the source of truth. These local Claude skills may include scripts, providers, and workflow rules that are not obvious from the top-level README.

| Command | Skill | Purpose |
|---------|-------|---------|
| `/harness-usage` | Case A/B/C/W workflow | Execute design workflows with 3-axis evaluation |
| `/harness-creator` | Harness improvement | Upgrade evaluation framework, add axes, bump versions |
| `/pencil-design` | Technical diagramming | Architecture diagrams, flowcharts, ERD in .pen files |
| `/pencil-deploy` | GitHub Pages deployment | Prepare (index.html + git push) then publish (version tag) |

### AI Image Generation

AI-generated raster images are handled through `.claude/skills/pencil-design/SKILL.md` and its image generation CLI:

- Script: `.claude/skills/pencil-design/scripts/image-gen.py`
- Default output: `image/{provider}/{YYYY-MM-DD}-{topic}.png`
- Gemini provider: `.claude/skills/pencil-design/scripts/providers/gemini_provider.py`
  - `--provider gemini`
  - Cloud generation and editing
  - Uses `.secret/gemini.json` or `GEMINI_SECRET_PATH`
- ComfyUI Z-Image-Turbo provider: `.claude/skills/pencil-design/scripts/providers/comfyui_provider.py`
  - `--provider comfyui`, `z-image`, or `z-image-turbo`
  - Local text-to-image generation only
  - Requires ComfyUI server at `http://192.168.0.64:8188`

When the user asks about AI image generation in this project, the expected answer is Gemini and ComfyUI/Z-Image-Turbo, not only generic image assets.

### Workflow Cases

- **Case A**: WebSearch WPF techniques → extract XAML → add animation cards to `design/wpf-animation.pen`
- **Case B**: Reference wpf-animation.pen → design project-specific .pen files
- **Case C**: Web animation research → JSON metadata → Pencil component
- **Case W**: Convert .pen design → HTML/CSS/JS in `design/xaml/output/sample{N}/`

## Path Conventions

All paths use **project-root-relative** format:
- Design files: `design/{name}.pen`
- XAML samples: `design/xaml/sample/{NN}.xaml`
- HTML output: `design/xaml/output/sample{NN}/index.html`
- Screenshots: `image/pencil/sample{N}/`
- AI generated images: `image/gemini/`, `image/comfyui/`, or sample-local `design/xaml/output/sample{NN}/img/`
- Project designs: `projects/design/{name}.pen`
- Harness config: `harness/harness.config.json`
- Harness knowledge: `harness/knowledge/design-craft.md`
- RPG status: `harness/logs/level-up/status.json`

## Architecture

```
harness/                    # 3-layer evaluation framework (v2.4.0)
├── knowledge/              #   Knowledge layer — scoring criteria per case
├── agents/                 #   Agents layer — evaluator decision trees
├── engine/                 #   Engine layer — state machine + RPG leveling
└── logs/                   #   Evaluation logs + RPG status

design/                     # Core design artifacts
├── wpf-animation.pen       #   Master template (12 CATs, 40+ cards)
├── xaml/sample/            #   27 WPF animation XAML sources
├── xaml/output/            #   HTML implementations + deploy index
└── json/sample/            #   Animation metadata JSON

design-wpf-app/             # .NET 10.0 WPF app for Blend timeline editing
projects/                   # Project-specific designs (e.g., publisher-app)
```

## Deployment

GitHub Pages deployment is **tag-triggered** via `.github/workflows/deploy-pages.yml`:
1. `/pencil-deploy` prepares: scans samples → updates `design/xaml/output/index.html` → commits + pushes
2. `/pencil-deploy` publishes: creates `v{X.Y.Z}` tag → GitHub Actions deploys `design/xaml/output/`

## Evaluation & RPG System

Each case is scored on 3 axes (total 100 points). XP formula: `base(score×10) × grade_multiplier × type_multiplier`. Pipeline bonuses (A→B→W: 1.5x) reward end-to-end workflows. Grades: A(80+), B(60-79), C(40-59), D(0-39).

## Key Rules

- `.pen` files are **only** accessible via Pencil MCP tools — never read them with file tools
- For AI image generation/editing, first consult `.claude/skills/pencil-design/SKILL.md` section "이미지 생성 / 편집 (Gemini · ComfyUI Z-Image-Turbo)"
- Always call `get_editor_state()` before working with Pencil MCP to understand current context
- WPF animation categories are CAT1–CAT13 in `design/wpf-animation.pen`
- The WPF app (`design-wpf-app/`) targets .NET 10.0 and is opened in Visual Studio Blend
