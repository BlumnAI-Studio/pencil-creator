# WPF Blend Animation XAML Research History

> 조사일: 2026-03-27
> 목적: 모던 WPF Storyboard 애니메이션 컨트롤 5종 조사 및 샘플 수집

---

## 1. Glass Effect Button

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - Walkthrough: Create a Button by Using XAML](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/controls/walkthrough-create-a-button-by-using-xaml) |
| 핵심 기술 | ControlTemplate, EventTrigger, ScaleTransform, RotateTransform |
| 애니메이션 | MouseEnter(글래스 페이드인+축소), MouseLeave(복원), Click(360도 회전) |
| 샘플 파일 | [`sample/01-glass-effect-button.xaml`](sample/01-glass-effect-button.xaml) |

---

## 2. Animated Navigation Drawer / Sidebar Menu

| 항목 | 내용 |
|------|------|
| 출처 | [GitHub - CSharpDesignPro/Navigation-Drawer-Sidebar-Menu-in-WPF](https://github.com/CSharpDesignPro/Navigation-Drawer-Sidebar-Menu-in-WPF) |
| 핵심 기술 | ToggleButton, DoubleAnimation, Width 속성 애니메이션 |
| 애니메이션 | Checked(65→230px 확장), Unchecked(230→65px 축소) |
| 샘플 파일 | [`sample/02-animated-sidebar-menu.xaml`](sample/02-animated-sidebar-menu.xaml) |

---

## 3. Rotating Loading Spinner

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - How to Make an Element Spin in Place](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/how-to-make-an-element-spin-in-place) |
| 참고 | [iditect.com - WPF Loading Spinner](https://www.iditect.com/faq/csharp/wpf-loading-spinner.html), [GitHub - LoadingIndicators.WPF](https://github.com/zeluisping/LoadingIndicators.WPF) |
| 핵심 기술 | RotateTransform, RepeatBehavior="Forever", StrokeDashArray |
| 애니메이션 | Loaded 이벤트로 0→360도 무한 회전 |
| 샘플 파일 | [`sample/03-rotating-loading-spinner.xaml`](sample/03-rotating-loading-spinner.xaml) |

---

## 4. Sliding Expandable Panel

| 항목 | 내용 |
|------|------|
| 출처 | [Bits Bobs Etc - Creating a Sliding Panel in WPF](https://bitsbobsetc.wordpress.com/2011/07/10/creating-a-sliding-panel-in-wpf/) |
| 핵심 기술 | TranslateTransform, AccelerationRatio/DecelerationRatio, MultiBinding |
| 애니메이션 | 우측 패널 슬라이드 인/아웃 (0.6s 이징 커브) |
| 샘플 파일 | [`sample/04-sliding-expandable-panel.xaml`](sample/04-sliding-expandable-panel.xaml) |

---

## 5. Color-Animated Content Control

| 항목 | 내용 |
|------|------|
| 출처 | [GitHub - microsoft/WPF-Samples ControlTemplateStoryboardExample](https://github.com/microsoft/WPF-Samples/blob/main/Animation/PropertyAnimation/ControlTemplateStoryboardExample.xaml) |
| 참고 | [moldstud.com - Step-by-Step Guide to Building Simple Storyboards in XAML](https://moldstud.com/articles/p-step-by-step-guide-to-building-simple-storyboards-in-xaml-your-ultimate-tutorial) |
| 핵심 기술 | ControlTemplate, ColorAnimation, SolidColorBrush, Trigger.EnterActions/ExitActions |
| 애니메이션 | MouseEnter(White→#CCCCFF 3s 자동반전), IsMouseOver(→Purple 1s), MouseLeave(→White 1s) |
| 샘플 파일 | [`sample/05-color-animated-control.xaml`](sample/05-color-animated-control.xaml) |

---

---

# 2차 조사 — 유형별 WPF 애니메이션 (2026-03-28)

> 목적: 4개 카테고리(데이터 입력 / 피드백 / 네비게이션 / 장식)별 다양한 애니메이션 패턴 조사

---

## CAT1: 데이터 입력 컨트롤 (Data Input Controls)

### 6. Floating Label TextBox

| 항목 | 내용 |
|------|------|
| 출처 | [Reflection IT - XAML Animated Headered TextBox Style](https://www.reflectionit.nl/blog/2017/xaml-animated-headered-textbox-style) |
| 핵심 기술 | VisualStateManager, TranslateTransform, ScaleTransform, ColorAnimation |
| 애니메이션 | Focus → Label Y↑18px + Scale 75% + Gray→Blue 색상 전환 |
| 샘플 파일 | [`sample/06-floating-label-textbox.xaml`](sample/06-floating-label-textbox.xaml) |

### 7. Animated ComboBox Dropdown

| 항목 | 내용 |
|------|------|
| 출처 | MaterialDesignInXAML ControlTemplate 패턴 참고 |
| 핵심 기술 | ScaleTransform on Popup, CubicEase, Opacity animation |
| 애니메이션 | IsDropDownOpen → ScaleY 0→1 (top-down unfold) + Opacity fade-in 250ms |
| 샘플 파일 | [`sample/07-animated-combobox.xaml`](sample/07-animated-combobox.xaml) |

### 8. Material Design Toggle Switch

| 항목 | 내용 |
|------|------|
| 출처 | [Harwood Tech - WPF Material Design Toggle Button](https://mharwood.uk/wpf-material-design-toggle-button/), [Medium - Building a Material Design Style Toggle Button](https://it-delinquent.medium.com/building-a-material-design-style-toggle-button-in-wpf-and-xaml-b7dcc4d5025f) |
| 핵심 기술 | TranslateTransform, ColorAnimation, DropShadowEffect |
| 애니메이션 | IsChecked → Knob X+20px + Track Gray→Green (AccelerationRatio 0.4) |
| 샘플 파일 | [`sample/08-toggle-switch.xaml`](sample/08-toggle-switch.xaml) |

---

## CAT2: 피드백 & 알림 (Feedback & Notification)

### 9. Snackbar / Toast Notification

| 항목 | 내용 |
|------|------|
| 출처 | [ResearchTech - Top-Sliding Snackbar in WPF](https://researchtech.net/index.php/2024/04/top-sliding-snackbar-notifications-in-wpf-c-using-mvvm/), [GitHub - ToastNotifications](https://github.com/rafallopatka/ToastNotifications) |
| 핵심 기술 | TranslateTransform, Opacity, BeginTime (auto-hide 3s) |
| 애니메이션 | TranslateY 60→0 slide up + Opacity 0→1 (CubicEase), 3초 후 자동 슬라이드 아웃 |
| 샘플 파일 | [`sample/09-snackbar-toast.xaml`](sample/09-snackbar-toast.xaml) |

### 10. Animated Progress Bar

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - ProgressBar Styles and Templates](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/controls/progressbar-styles-and-templates) |
| 핵심 기술 | DoubleAnimation on Value, TranslateTransform (indeterminate), SineEase |
| 애니메이션 | Indeterminate: 슬라이딩 바 ←→ 반복, Value: 0→100% smooth fill (QuadraticEase) |
| 샘플 파일 | [`sample/10-animated-progressbar.xaml`](sample/10-animated-progressbar.xaml) |

### 11. Badge Counter Pop

| 항목 | 내용 |
|------|------|
| 출처 | [Syncfusion - Badge Customization](https://help.syncfusion.com/wpf/badge/badge-customization), [GitHub Gist - Pulse Animation](https://gist.github.com/mohamedmansour/9fa64785496ceeabd991) |
| 핵심 기술 | ScaleTransform, DoubleAnimationUsingKeyFrames, ElasticEase |
| 애니메이션 | 값 변경 → Scale 1→1.3→1.0 (ElasticEase bounce, 300ms) |
| 샘플 파일 | [`sample/11-badge-counter-pop.xaml`](sample/11-badge-counter-pop.xaml) |

---

## CAT3: 네비게이션 & 전환 (Navigation & Transitions)

### 12. Page / Content Transition

| 항목 | 내용 |
|------|------|
| 출처 | [CodeProject - Simple WPF Page Transitions](https://www.codeproject.com/Articles/197132/Simple-WPF-Page-Transitions), [Marko Devcic - Animating WPF ContentControl](https://www.markodevcic.com/post/Animating_WPF_ContentControl_Part_1/) |
| 핵심 기술 | TranslateTransform + Opacity, CubicEase, ContentControl ControlTemplate |
| 애니메이션 | Old content: slide left(-300px)+fade out / New content: slide in(+300px)+fade in (400ms) |
| 샘플 파일 | [`sample/12-page-transition.xaml`](sample/12-page-transition.xaml) |

### 13. Tab Control Slide Animation

| 항목 | 내용 |
|------|------|
| 출처 | [Syncfusion - Tab Navigation Animation](https://help.syncfusion.com/wpf/tab-navigation/animation), [Microsoft Q&A - Animated TabControl](https://learn.microsoft.com/en-us/answers/questions/803164/) |
| 핵심 기술 | TranslateTransform per direction, Opacity, QuadraticEase |
| 애니메이션 | 탭 이동 방향에 따라 Left/Right 슬라이드 + Opacity 0.3→1 (350ms) |
| 샘플 파일 | [`sample/13-tab-slide.xaml`](sample/13-tab-slide.xaml) |

### 14. Hamburger → X Morph

| 항목 | 내용 |
|------|------|
| 출처 | [MahApps - HamburgerMenu](https://mahapps.com/docs/controls/HamburgerMenu), CSS/XAML morph 패턴 참고 |
| 핵심 기술 | RotateTransform, TranslateTransform, Opacity, CubicEase |
| 애니메이션 | Middle line Opacity→0, Top Y+7+Rotate45°, Bottom Y-7+Rotate-45° (250ms) |
| 샘플 파일 | [`sample/14-hamburger-to-x.xaml`](sample/14-hamburger-to-x.xaml) |

---

## CAT4: 장식 & 배경 (Decorative & Background)

### 15. Animated Gradient Background

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - Animate GradientStop Position or Color](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/how-to-animate-the-position-or-color-of-a-gradient-stop), [C# Corner - Color Animation in LinearGradientBrush](https://www.c-sharpcorner.com/Resources/893/) |
| 핵심 기술 | ColorAnimation on GradientStop.Color, DoubleAnimation on Offset |
| 애니메이션 | 3개 Stop 색상 순환(4s), Offset 0.3↔0.7 진동, AutoReverse=Forever |
| 샘플 파일 | [`sample/15-animated-gradient-bg.xaml`](sample/15-animated-gradient-bg.xaml) |

### 16. Particle / Floating Dots

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft WPF-Samples - Per-Frame Animation / ParticleEffects](https://github.com/microsoft/WPF-Samples/blob/main/Animation/Per-FrameAnimation/), [CodeProject - Particle Effects in WPF](https://www.codeproject.com/articles/Particle-Effects-in-WPF) |
| 핵심 기술 | Canvas.Top/Left DoubleAnimation, Opacity lifecycle, staggered BeginTime |
| 애니메이션 | 다수의 Ellipse가 하단→상단 부유, 각각 다른 시작 시간/속도/투명도 |
| 샘플 파일 | [`sample/16-particle-floating-dots.xaml`](sample/16-particle-floating-dots.xaml) |

### 17. Pulsing Glow Effect

| 항목 | 내용 |
|------|------|
| 출처 | [Infragistics - Drop Shadow / Glow Effect](https://www.infragistics.com/blogs/drop-shadow-glow-effect-xaml/), [BlogSpot - WPF Advanced Animation Effects](http://shashtricodewiki.blogspot.com/2015/08/wpf-advanced-xaml-animation-effects.html) |
| 핵심 기술 | DropShadowEffect (ShadowDepth=0), BlurRadius/Opacity animation, SineEase |
| 애니메이션 | BlurRadius 10→30 + Opacity 0.4→0.9 breathing pulse (SineEase, 1.2s, Forever) |
| 샘플 파일 | [`sample/17-pulsing-glow.xaml`](sample/17-pulsing-glow.xaml) |

---

---

# 3차 조사 — 봄 & 자연 파티클 애니메이션 (2026-03-28)

> 목적: 봄 시즌 테마(벚꽃, 꽃잎, 봄바람) WPF 파티클 애니메이션 기법 조사 및 CAT12 추가

---

## CAT12: 봄 & 자연 파티클 (Spring & Nature Particle)

### 18. Cherry Blossom Petal Fall (벚꽃 꽃잎 낙하)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - DoubleAnimation](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/how-to-animate-a-property-by-using-a-storyboard), [CodeProject - Animation using Storyboards](https://www.codeproject.com/Articles/364529/Animation-using-Storyboards-in-WPF) |
| 핵심 기술 | Canvas + TranslateTransform Y, RotateTransform, OpacityAnimation, QuadraticEase |
| 애니메이션 | 꽃잎 Path 요소가 위→아래 낙하 + 회전 + 투명도 감소, BeginTime stagger로 순차 등장 |
| 샘플 파일 | [`sample/18-cherry-blossom-fall.xaml`](sample/18-cherry-blossom-fall.xaml) |

### 19. Petal Scatter Wind (꽃잎 흩날리기)

| 항목 | 내용 |
|------|------|
| 출처 | [Medium - Moving Elements with TranslateTransform Animation](https://medium.com/@artillustration391/moving-elements-with-storyboards-translatetransform-animation-in-wpf-0ac391441b37), [Medium - Scale & Rotate with WPF Storyboards](https://medium.com/@artillustration391/scale-rotate-your-ui-dynamic-transforms-with-wpf-storyboards-602bcbc061f3) |
| 핵심 기술 | TranslateTransform X/Y 복합, ScaleTransform 원근 축소, RotateTransform 회전 |
| 애니메이션 | 바람에 날리는 꽃잎: 좌→우 수평 이동 + 약간의 수직 드리프트 + 크기 축소(원거리 효과) + 페이드아웃 |
| 샘플 파일 | [`sample/19-petal-scatter-wind.xaml`](sample/19-petal-scatter-wind.xaml) |

### 20. Spring Breeze Sway (봄바람 흔들림)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - Animation Overview](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/animation-overview), [Microsoft Learn - Transforms Overview](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/transforms-overview) |
| 핵심 기술 | DoubleAnimation AutoReverse + Forever, SineEase, TranslateTransform.X 진동 |
| 애니메이션 | 꽃줄기/잎사귀가 SineEase로 좌우 ±5~15° 부드럽게 흔들림, 꽃봉오리도 연동 진동 |
| 샘플 파일 | [`sample/20-spring-breeze-sway.xaml`](sample/20-spring-breeze-sway.xaml) |

---

## 추가 참고 자료

| 리소스 | URL |
|--------|-----|
| MaterialDesignInXamlToolkit Transitions | https://github.com/MaterialDesignInXAML/MaterialDesignInXamlToolkit/wiki/Transitions |
| WPF Material Design Toggle Button | https://mharwood.uk/wpf-material-design-toggle-button/ |
| WPF UI (Fluent Design) | https://github.com/lepoco/wpfui |
| Storyboard 가이드 (moldstud) | https://moldstud.com/articles/p-step-by-step-guide-to-building-simple-storyboards-in-xaml-your-ultimate-tutorial |

---

# 4차 조사 — 사이버 & 디지털 애니메이션 (2026-03-29)

> 목적: Cyberpunk/Futuristic UI 감성의 WPF 애니메이션 기법 6종 조사 및 CAT13 추가

---

## CAT13: 사이버 & 디지털 효과 (Cyber & Digital Effects)

### 22. Glitch Jitter (글리치 떨림)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - Animation Tips](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/animation-tips-and-tricks), [Medium - TranslateTransform Animation](https://medium.com/@artillustration391/moving-elements-with-storyboards-translatetransform-animation-in-wpf-0ac391441b37) |
| 핵심 기술 | TranslateTransform X/Y, DiscreteDoubleKeyFrame, OpacityAnimation, ScaleTransform |
| 애니메이션 | 급격한 X/Y 오프셋(±8~12px) + Opacity 플리커(0.3↔1.0) + ScaleX 왜곡(±3%), 1초 간격 반복 |
| 샘플 파일 | [`sample/22-glitch-jitter.xaml`](sample/22-glitch-jitter.xaml) |

### 23. Neon Glow Pulse (네온 글로우 펄스)

| 항목 | 내용 |
|------|------|
| 출처 | [Infragistics - Glow Effect](https://www.infragistics.com/blogs/drop-shadow-glow-effect-xaml/), [Microsoft Learn - DropShadowEffect](https://learn.microsoft.com/en-us/previous-versions/windows/silverlight/dotnet-windows-silverlight/cc490119(v=vs.95)) |
| 핵심 기술 | DropShadowEffect (ShadowDepth=0), BlurRadius/Opacity DoubleAnimation, ColorAnimation |
| 애니메이션 | BlurRadius 15→40 breathing + Color Cyan↔Magenta cycling (SineEase, 1.5s, AutoReverse ∞) |
| 샘플 파일 | [`sample/23-neon-glow-pulse.xaml`](sample/23-neon-glow-pulse.xaml) |

### 24. RGB Split / Chromatic Aberration (색수차 분리)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - Transforms Overview](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/transforms-overview), [GitHub - WPF-Samples](https://github.com/microsoft/WPF-Samples) |
| 핵심 기술 | 3-layer TranslateTransform (R/G/B 채널 분리), DiscreteDoubleKeyFrame |
| 애니메이션 | Red X-3~-8px, Green Y±4px, Blue X+3~+8px 오프셋 + 메인 White 레이어 상단, 3초 주기 |
| 샘플 파일 | [`sample/24-rgb-split-chromatic.xaml`](sample/24-rgb-split-chromatic.xaml) |

### 25. Scanline Sweep (스캔라인 스윕)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - Opacity Animation](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/how-to-animate-the-opacity-of-an-element-or-brush), [CodeGuru - WPF Animation Effects](https://www.codeguru.com/dotnet/interesting-animation-effects-with-wpf/) |
| 핵심 기술 | TranslateTransform.Y sweep, LinearGradientBrush (cyan glow), DrawingBrush CRT 오버레이 |
| 애니메이션 | Y -20→400px QuadraticEase 2.5s + Opacity pulse 0.3↔0.9 + 정적 CRT 줄무늬 8% |
| 샘플 파일 | [`sample/25-scanline-sweep.xaml`](sample/25-scanline-sweep.xaml) |

### 26. Digital Matrix Rain (디지털 매트릭스 레인)

| 항목 | 내용 |
|------|------|
| 출처 | [CodeProject - Advanced Animations in WPF](https://www.codeproject.com/Articles/376163/Advanced-Animations-in-WPF), [Microsoft Learn - Storyboards Overview](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/storyboards-overview) |
| 핵심 기술 | Canvas TextBlock columns, TranslateTransform.Y cascade, staggered BeginTime, Opacity lifecycle |
| 애니메이션 | 6개 컬럼 하강 (3.2~5s), BeginTime 0~1s stagger, Opacity 0.8→0.2 fade, Cyan/Green 교차 |
| 샘플 파일 | [`sample/26-digital-matrix-rain.xaml`](sample/26-digital-matrix-rain.xaml) |

### 27. Holographic Shimmer (홀로그래픽 쉬머)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - Animate GradientStop](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/how-to-animate-the-position-or-color-of-a-gradient-stop), [C# Corner - Color Animation](https://www.c-sharpcorner.com/Resources/893/) |
| 핵심 기술 | LinearGradientBrush 4-stop, ColorAnimation iridescent, DoubleAnimation Offset sweep |
| 애니메이션 | Cyan↔Purple↔Lime↔Amber 무지개빛 전환 + Offset 0.2↔0.8 SineEase 2s AutoReverse ∞ |
| 샘플 파일 | [`sample/27-holographic-shimmer.xaml`](sample/27-holographic-shimmer.xaml) |

---

## COMBINED SAMPLE: Cyberpunk HUD Panel

| 항목 | 내용 |
|------|------|
| 조합 기법 | Glitch Jitter + Neon Glow Pulse + RGB Split + Scanline Sweep |
| 파이프라인 | Phase 1 글리치(0~200ms) → Phase 2 네온 안정화(200ms~∞) → Phase 3 RGB 분리(500ms~∞) → Phase 4 스캔라인(0~∞) |
| 가치 | 4개 기법의 통합 구현 예시, Case W에서 즉시 HTML 변환 가능 |

---

## 추가 참고 자료

| 리소스 | URL |
|--------|-----|
| XamlFlair Animation Library | https://github.com/XamlFlair/XamlFlair |
| WPF Advanced Animation Effects | http://shashtricodewiki.blogspot.com/2015/08/wpf-advanced-xaml-animation-effects.html |
| WPF Fluid Segmented Control | https://medium.com/@artillustration391/mastering-modern-ui-creating-a-fluid-animated-segmented-control-in-wpf-4db952ddeac3 |

---

# 5차 조사 — Peace & Meditation 애니메이션 (2026-03-31)

> 목적: 평화/명상 테마 WPF 애니메이션 5종 조사 및 CAT14 추가

---

## CAT14: 평화 & 명상 (Peace & Meditation)

### 28. Zen Breathing Circle (젠 호흡 원)

| 항목 | 내용 |
|------|------|
| 출처 | [CodeProject - Pulse Button WPF](https://www.codeproject.com/Articles/996417/Pulse-Button-WPF), [GitHub Gist - Pulse Animation](https://gist.github.com/mohamedmansour/9fa64785496ceeabd991) |
| 핵심 기술 | ScaleTransform (multi-ring), OpacityAnimation, SineEase EaseInOut, DropShadowEffect |
| 애니메이션 | 3층 동심원 Scale 0.6→1.4 (4s) + Opacity 0.3→1.0, 각 링 BeginTime stagger 0.3s |
| 샘플 파일 | [`sample/28-zen-breathing-circle.xaml`](sample/28-zen-breathing-circle.xaml) |

### 29. Water Ripple Emanation (수면 파문)

| 항목 | 내용 |
|------|------|
| 출처 | [Adonis UI - Ripple Effect](https://benruehl.github.io/adonis-ui/docs/guides/ripple/), [Microsoft Learn - Animation Overview](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/animation-overview) |
| 핵심 기술 | ScaleTransform 0→8 확장, OpacityAnimation 1→0 페이드, Staggered BeginTime |
| 애니메이션 | 3개 동심 링 중앙에서 확산 + 투명도 감소, BeginTime 0s/0.8s/1.6s stagger, 3s 주기 |
| 샘플 파일 | [`sample/29-water-ripple-emanation.xaml`](sample/29-water-ripple-emanation.xaml) |

### 30. Floating Feather Drift (깃털 부유)

| 항목 | 내용 |
|------|------|
| 출처 | [Medium - TranslateTransform Animation](https://medium.com/@artillustration391/moving-elements-with-storyboards-translatetransform-animation-in-wpf-0ac391441b37), [Medium - Scale & Rotate](https://medium.com/@artillustration391/scale-rotate-your-ui-dynamic-transforms-with-wpf-storyboards-602bcbc061f3) |
| 핵심 기술 | TranslateTransform X(sin파) + Y(하강), RotateTransform ±15°, OpacityAnimation |
| 애니메이션 | 깃털 Path 수평 진동(±30px, 3s) + 수직 하강(0→500, 8s) + 회전(±15°, 2.5s) + 페이드 |
| 샘플 파일 | [`sample/30-floating-feather-drift.xaml`](sample/30-floating-feather-drift.xaml) |

### 31. Soft Aurora Gradient (오로라 그라디언트)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - Animate GradientStop](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/how-to-animate-the-position-or-color-of-a-gradient-stop), [C# Corner - Color Animation](https://www.c-sharpcorner.com/Resources/893/) |
| 핵심 기술 | LinearGradientBrush 4-stop, ColorAnimation 순환, DoubleAnimation Offset 진동 |
| 애니메이션 | DeepBlue↔Teal↔Mint↔Lavender 8s 순환 + Offset 0.2↔0.8 SineEase AutoReverse ∞ |
| 샘플 파일 | [`sample/31-soft-aurora-gradient.xaml`](sample/31-soft-aurora-gradient.xaml) |

### 32. Zen Fade Cascade (젠 페이드 캐스케이드)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - Storyboards Overview](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/storyboards-overview), [CodeProject - Animation using Storyboards](https://www.codeproject.com/Articles/364529/Animation-using-Storyboards-in-WPF) |
| 핵심 기술 | OpacityAnimation 0→1, PowerEase EaseOut (Power=3), BeginTime +500ms stagger |
| 애니메이션 | 4개 텍스트 요소 순차 등장 (Breathe→Release→Peace→Stillness), 1.2s 각, +500ms stagger |
| 샘플 파일 | [`sample/32-zen-fade-cascade.xaml`](sample/32-zen-fade-cascade.xaml) |

---

## COMBINED SAMPLE: Peaceful Zen Garden

| 항목 | 내용 |
|------|------|
| 조합 기법 | Zen Breathing Circle + Water Ripple + Floating Feather + Soft Aurora + Zen Fade Cascade |
| 파이프라인 | Breathing (Scale 4s) → Ripple (Expand 3s stagger) → Feather (Drift 8s) → Aurora (Color 8s) → Cascade (Fade +500ms) |
| 가치 | 5개 평화 기법의 통합 구현, Case W에서 명상 UI 즉시 HTML 변환 가능 |

---

## 추가 참고 자료

| 리소스 | URL |
|--------|-----|
| Pulse Button WPF | https://www.codeproject.com/Articles/996417/Pulse-Button-WPF |
| Adonis UI Ripple Guide | https://benruehl.github.io/adonis-ui/docs/guides/ripple/ |
| WPF Storyboard Fade In/Out | https://medium.com/@artillustration391/wpf-storyboards-your-first-animation-fade-in-out-5499dd38433f |

---

# 6차 조사 — Space & Astral 3D Interface (2026-03-31)

> 목적: 우주/은하/성운 기반 3D UI 애니메이션 6종 조사 및 CAT15 추가
> 핵심 방향: 깊이감(Z축) + 공간감 + 카메라 이동 + WPF Viewport3D/2.5D 혼합

---

## CAT15: 우주 & 아스트랄 3D 인터페이스 (Space & Astral 3D Interface)

### 33. Starfield Depth System (별필드 깊이 시스템)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - 3D Graphics Overview](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/3-d-graphics-overview), [CodeProject - Particle Effects in WPF](https://www.codeproject.com/articles/Particle-Effects-in-WPF) |
| 핵심 기술 | Canvas multi-layer, CompositionTarget.Rendering, Z-depth → size/speed/opacity mapping |
| 애니메이션 | 3-layer: bg(slow/dim/1~2px) + mid(medium/3px) + fg(fast/bright/4~5px+glow), 좌→우 이동 |
| 샘플 파일 | [`sample/33-starfield-depth-system.xaml`](sample/33-starfield-depth-system.xaml) |

### 34. Parallax Camera Shift (패럴랙스 카메라 시프트)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - Animate Camera Position](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/how-to-animate-camera-position-and-direction-in-a-3d-scene), [Eric Sink - WPF 3D Rotate & Zoom](https://ericsink.com/wpf3d/9_Rotate_Zoom.html) |
| 핵심 기술 | TranslateTransform per-layer speed factor, ScaleTransform zoom, SineEase orbit drift |
| 애니메이션 | bg ±15px(0.3x), mid ±30px(0.6x), fg ±50px(1.0x) + ScaleTransform 1.0→1.05 zoom 10s |
| 샘플 파일 | [`sample/34-parallax-camera-shift.xaml`](sample/34-parallax-camera-shift.xaml) |

### 35. Nebula Cosmic Fog (성운 코스믹 포그)

| 항목 | 내용 |
|------|------|
| 출처 | [CodeProject - Shader Effects in WPF](https://www.codeproject.com/Articles/994276/Shader-Effects-in-WPF-The-basics), [Microsoft Learn - BlurEffect Animation](https://learn.microsoft.com/en-us/archive/msdn-technet-forums/72976004-495e-46f9-aaa7-ba66d5fdae66) |
| 핵심 기술 | RadialGradientBrush overlapping ellipses, BlurEffect Radius 15~25, ColorAnimation, ScaleTransform |
| 애니메이션 | Purple↔Blue↔Pink 색상 순환 6~7s + Scale 0.9→1.15 + Opacity breathing |
| 샘플 파일 | [`sample/35-nebula-cosmic-fog.xaml`](sample/35-nebula-cosmic-fog.xaml) |

### 36. Galaxy Swirl Motion (은하 소용돌이)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - 3D Transformations Overview](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/3-d-transformations-overview), [Barth Dev - Getting Started 3D WPF](https://barth-dev.de/getting-started-3d-wpf/) |
| 핵심 기술 | RotateTransform on Canvas orbit rings, DropShadowEffect center glow, spiral particle placement |
| 애니메이션 | Inner orbit 6s, Mid 12s, Outer 20s 회전 + center glow BlurRadius 30→60 pulse 4s |
| 샘플 파일 | [`sample/36-galaxy-swirl-motion.xaml`](sample/36-galaxy-swirl-motion.xaml) |

### 37. Volumetric Light Beams (볼류메트릭 라이트 빔)

| 항목 | 내용 |
|------|------|
| 출처 | [CodeProject - Getting Started with Shader Effects](https://www.codeproject.com/articles/Getting-Started-with-Shader-Effects-in-WPF), [GitHub - WpfShaders](https://github.com/mdschweda/WpfShaders) |
| 핵심 기술 | Path cone + LinearGradientBrush, BlurEffect 6~10, DropShadowEffect light source, OpacityAnimation |
| 애니메이션 | Opacity 0.3→0.8 SineEase 3s + secondary beam 4s BeginTime 1s stagger |
| 샘플 파일 | [`sample/37-volumetric-light-beams.xaml`](sample/37-volumetric-light-beams.xaml) |

### 38. Hologram Floating Panel (홀로그램 부유 패널)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - Opacity Animation](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/how-to-animate-the-opacity-of-an-element-or-brush), [GitHub - FluentWpfChromes (Blur/Acrylic)](https://github.com/vbobroff-app/FluentWpfChromes) |
| 핵심 기술 | Border semi-transparent + DropShadowEffect neon, TranslateTransform.Y oscillation, scanline sweep |
| 애니메이션 | TranslateY ±8px SineEase 3s + scanline sweep Y -55→120 2.5s + cascade fade PowerEase 0.8s |
| 샘플 파일 | [`sample/38-hologram-floating-panel.xaml`](sample/38-hologram-floating-panel.xaml) |

---

## COMBINED SAMPLE: Astral Command Center

| 항목 | 내용 |
|------|------|
| 조합 기법 | Starfield + Parallax + Nebula + Galaxy + Volumetric Light + Hologram Panel |
| 파이프라인 | Starfield(Z-depth bg) → Nebula(fog overlay) → Galaxy(center swirl) → Light(beams) → Hologram(floating UI) → Parallax(camera) |
| 가치 | 6개 기법의 통합 우주 UI, Case W에서 WebGL/Canvas 기반 즉시 HTML 변환 가능 |

---

## 추가 참고 자료

| 리소스 | URL |
|--------|-----|
| WPF 3D Graphics Overview | https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/3-d-graphics-overview |
| WPF 3D Camera Animation | https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/how-to-animate-camera-position-and-direction-in-a-3d-scene |
| WPF ShaderEffects Library | https://github.com/mrange/WPFShaderEffects |
| Web Starfield (Canvas) | https://github.com/anthony-hopkins/web_starfield |
| WebGL Parallax Starfield | https://github.com/rocket-boots/webgl-starfield |
| Interactive 3D Galaxy | https://codetap.org/project/interactive-3d-galaxy-animation |

---

# 7차 조사 — 캐릭터 애니메이션 (2026-04-30)

> 목적: 12 Principles of Animation 기반 WPF 캐릭터 애니메이션 6종 조사 및 CAT17 추가
> 신규 패러다임: 기존 CAT1~16에 부재했던 "캐릭터" 컨텍스트 (스프라이트/스켈레탈/idle 사이클)

---

## CAT17: 캐릭터 애니메이션 (Character Animation)

### 39. Sprite Sheet Walk Cycle (스프라이트 시트 워크 사이클)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - Animation Overview](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/animation-overview), [Microsoft Learn - Storyboards Overview](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/storyboards-overview), [CodeProject - Animation using Storyboards](https://www.codeproject.com/Articles/364529/Animation-using-Storyboards-in-WPF) |
| 핵심 기술 | ImageBrush.Viewbox + RectAnimationUsingKeyFrames, DiscreteRectKeyFrame |
| 애니메이션 | 8 셀 × 96px sprite sheet, 0.1s/frame discrete swap, 0.8s loop, RepeatBehavior=Forever |
| 샘플 파일 | [`sample/39-sprite-sheet-walk-cycle.xaml`](sample/39-sprite-sheet-walk-cycle.xaml) |

### 40. Squash & Stretch (스쿼시 & 스트레치)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - DoubleAnimation Tutorial](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/how-to-animate-a-property-by-using-a-storyboard), [Disney 12 Principles of Animation](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation), [moldstud - Storyboards in XAML](https://moldstud.com/articles/p-step-by-step-guide-to-building-simple-storyboards-in-xaml-your-ultimate-tutorial) |
| 핵심 기술 | ScaleTransform non-uniform (ScaleX↔ScaleY 반비례), QuadraticEase, SplineDoubleKeyFrame |
| 애니메이션 | 점프 시 ScaleX 0.85 ScaleY 1.20 (stretch) → 착지 시 ScaleX 1.50 ScaleY 0.55 (squash) → 1.0 복귀, RenderTransformOrigin 0.5,1.0 (volume preservation) |
| 샘플 파일 | [`sample/40-squash-and-stretch.xaml`](sample/40-squash-and-stretch.xaml) |

### 41. Idle Breathing Loop (대기 호흡 루프)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - SineEase EasingMode](https://learn.microsoft.com/en-us/dotnet/api/system.windows.media.animation.sineease), [GitHub - XamlFlair Animation Library](https://github.com/XamlFlair/XamlFlair) |
| 핵심 기술 | ScaleTransform ScaleY 1.0→1.04 + ScaleX 1.0→1.02 + TranslateTransform.Y -3px, SineEase EaseInOut, AutoReverse=True, RepeatBehavior=Forever |
| 애니메이션 | 미세 호흡 효과 (1.6s 주기), RenderTransformOrigin 0.5,1.0 (발 고정), 자연스러운 idle 상태 표현 |
| 샘플 파일 | [`sample/41-idle-breathing.xaml`](sample/41-idle-breathing.xaml) |

### 42. Eye Blink Sequence (눈 깜빡임 시퀀스)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - LinearDoubleKeyFrame](https://learn.microsoft.com/en-us/dotnet/api/system.windows.media.animation.lineardoublekeyframe), [Petr Závodný - Basic Animations in WPF](https://www.petrzavodny.com/blog/BasicAnimationsWPFMini.html) |
| 핵심 기술 | ScaleTransform.ScaleY 1.0 → 0.05 → 1.0, LinearDoubleKeyFrame, BeginTime stagger 0.02s (자연스러운 양안 비대칭) |
| 애니메이션 | 단일 깜빡임 0.1s, double-blink @5s 추가, 평상시 ~3s 간격 자동 깜빡임, 캐릭터 생동감 표현 |
| 샘플 파일 | [`sample/42-eye-blink-sequence.xaml`](sample/42-eye-blink-sequence.xaml) |

### 43. Head Tracking / Look-at Cursor (시선 추적)

| 항목 | 내용 |
|------|------|
| 출처 | [Microsoft Learn - MouseEventArgs.GetPosition](https://learn.microsoft.com/en-us/dotnet/api/system.windows.input.mouseeventargs.getposition), [Microsoft Learn - RotateTransform](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/transforms-overview) |
| 핵심 기술 | RotateTransform code-behind via MouseMove, Math.Atan2(dy, dx) → degrees, damping 0.15, TransformGroup (Rotate + Translate eye-offset) |
| 애니메이션 | 머리 ±15° 기울기 + 동공 ±6px 오프셋 (clamp), 마우스 위치 따라 실시간 추적, 인터랙티브 UI |
| 샘플 파일 | [`sample/43-head-tracking.xaml`](sample/43-head-tracking.xaml) |

### 44. Anticipation & Follow-Through (사전동작 & 잔여동작)

| 항목 | 내용 |
|------|------|
| 출처 | [Disney 12 Principles - Anticipation & Follow-Through](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation), [Microsoft Learn - SplineDoubleKeyFrame](https://learn.microsoft.com/en-us/dotnet/api/system.windows.media.animation.splinedoublekeyframe) |
| 핵심 기술 | SplineDoubleKeyFrame (KeySpline 0.4,0,0.2,1), TranslateTransform.X 4단계 (-30 → 280 → 310 overshoot → 280 settle), 동시 RotateTransform tilt |
| 애니메이션 | 1.전조 (0.4s pull-back) → 2.본동작 (0.5s dash) → 3.오버슛 (0.15s 잔여) → 4.안정 (0.35s settle) — 액션 4단계 타임라인 |
| 샘플 파일 | [`sample/44-anticipation-followthrough.xaml`](sample/44-anticipation-followthrough.xaml) |

---

## COMBINED SAMPLE: Pixel Hero Animation Suite

| 항목 | 내용 |
|------|------|
| 조합 기법 | Sprite Walk Cycle + Idle Breathing + Squash & Stretch + Eye Blink |
| 파이프라인 | Walk (RectAnim 8 frames) ⇄ Idle Breath (ScaleY SineEase 1.6s) → Land Squash (KeySpline 0.15s) → Blink (LinearKey 0.1s @3s 간격) |
| 가치 | 캐릭터 1체에 4기법 동시 적용, 게임/게이미피케이션 UI 즉시 활용 가능 (Case W에서 CSS animation + WAAPI 변환) |

---

## 추가 참고 자료

| 리소스 | URL |
|--------|-----|
| Disney 12 Principles of Animation | https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation |
| WPF Sprite Animation Guide | https://learn.microsoft.com/en-us/dotnet/desktop/wpf/graphics-multimedia/animation-overview |
| XamlFlair Animation Library | https://github.com/XamlFlair/XamlFlair |
