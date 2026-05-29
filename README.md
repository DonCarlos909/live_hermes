# HERMES — Cybernetic Intelligence Interface v2.0

> *"I'm not a chatbot. I'm your onboard AI."*

A cyberpunk tactical AI command interface desktop app with holographic avatar, orbital agent network, 3D particle background, and real-time telemetry — built with Tauri 2, React 18, and Three.js.

![HERMES](https://img.shields.io/badge/HERMES-v2.0-00e8ff?style=flat-square)
![Tauri](https://img.shields.io/badge/Tauri-2.0-22d3ee?style=flat-square)
![React](https://img.shields.io/badge/React-18-00e8ff?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-22d3ee?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Windows-00e8ff?style=flat-square)

## Download & Install

### Windows (One-Click)

1. **Download** → [Hermes_2.0.0_x64-setup.exe](https://github.com/DonCarlos909/live_hermes/releases/download/v2.0.0/Hermes_2.0.0_x64-setup.exe) (5.2 MB)
2. **Run** the installer
3. **Open** Hermes from Start menu

> ⚠️ Windows SmartScreen may warn on first run. Click **"More info" → "Run anyway"** — normal for unsigned open-source apps.

### Build from Source

```bash
# Prerequisites: Node.js 20+, Rust (via rustup), Tauri CLI
git clone https://github.com/DonCarlos909/live_hermes.git
cd live_hermes

npm install

# Web preview only (no Tauri shell)
npm run dev

# Full desktop app (Tauri window)
npm run tauri dev

# Build Windows installer (.exe)
npm run tauri build
```

---\n

## Interface Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  ≡ HERMES v2.0    ● ONLINE    IDLE MODE    AGENTS: RECON | CODE | CTF | HERMES │
├────────────┬────────────────────────────────────────────┬────────────────┤
│            │                                            │                │
│  AGENTS    │             ● HERMES (Avatar Core)         │  TELEMETRY     │
│  MEMORY    │          (orbital ring w/ arms)            │  ────────────  │
│  TOOLS     │        ←◄---- Horizontal arm ----►→        │  ═══════════   │
│  TASKS     │                                            │  ────────────  │
│  FILES     │                                            │  ══   ██   ══  │
├────────────┴────────────────────────────────────────────┴────────────────┤
│  ▷ CHAT  │  TACTICAL  │  CODING  │  CTF  │  RESEARCH  │  AUTO  │ [SETTINGS] │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │ [SYS]   SYSTEM DIAGNOSTICS COMPLETE.                           │      │
│  │ HERMES ▶ All systems nominal. Awaiting your command.           │      │
│  │ USER   ▶ Initiate reconnaissance scan.                         │      │
│  └────────────────────────────────────────────────────────────────┘      │
│  ▶  Enter command...                                       [≡] [◄►]    │
└─────────────────────────────────────────────────────────────────────────┘
```

---\n

## Features

|| Feature | Description |
||---------|-------------|
|| 👁️ **Holographic Avatar** | AI face with idle/speaking/thinking/listening states, double orbital ring with horizontal arms, floating particle field |
|| 🌌 **Starfield Background** | Deep space gradient with animated scanlines and subtle vignette |
|| 💫 **Orbital Agent Network** | Circular bubble map with HERMES at center, satellite agents on elliptical orbit, connector lines |
|| 💬 **Streaming Command Interface** | Typewriter text effect, mode-based responses, cursor blink, chat history |
|| 🖥️ **Telemetry Panel** | System metrics with horizontal progress bars, status lines, connection indicators |
|| 🎨 **Mode System** | Chat, Tactical, Coding, CTF, Research, Autonomous — each with unique color accent |
|| ✨ **Hologram FX** | Scanlines, vignette, chromatic aberration simulation, ambient glow |
|| 🧠 **Memory & Tools Panels** | Neural network visualization, holographic tool activation grid |
|| 📋 **Task Panel** | Agent-specific task tracking with progress indicators |
|| ⚙️ **Settings Panel** | LLM config, Ollama manager, Hermes Docker bridge, user guide |

---\n

## Tech Stack

|| Layer | Technology |
||-------|-----------|
|| Shell | Tauri 2 (Rust) |
|| Frontend | React 18 + Vite 6 + TypeScript 5.6 |
|| Styling | Tailwind CSS 4 + custom CSS variables |
|| 3D | Three.js (starfield background placeholder) |
|| State | Zustand 5 |
|| Animations | Framer Motion 11 |
|| Icons | Lucide React |
|| Fonts | Orbitron + Share Tech Mono |

---\n

## Color Palette

|| Role | Name | Hex |
||------|------|-----|
|| Background Void | --bg-void | `#040810` |
|| Background Panel | --bg-panel | `#070d18` |
|| Border Panel | --border-panel | `#0d2035` |
|| Surface | --bg-surface | `#0a1220` |
|| Primary Cyan | --cyan-primary | `#00e8ff` |
|| Cyan Glow | --cyan-glow | `rgba(0,232,255,0.18)` |
|| Cyan Dim | --cyan-dim | `#006f88` |
|| Cyan Mid | --cyan-mid | `#009ab5` |
|| Online Status | --green-online | `#00ff55` |
|| System Alert | --amber-sys | `#e8a020` |
|| Critical Metric | --red-bar | `#ff2244` |
|| Primary Text | --text-primary | `#d8eeff` |
|| Secondary Text | --text-secondary | `#4a7a90` |

---\n

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend                              │
│  ┌──────────┬──────────────┬──────────────┬──────────────┐  │
│  │  TopBar  │  LeftPanel   │  MainArea    │  RightPanel  │  │
│  │          │  (agents)    │  (avatar)    │  (telemetry) │  │
│  │          │              │              │              │  │
│  │          │              │              │              │  │
│  │          │              │              │              │  │
│  └──────────┴──────────────┴──────────────┴──────────────┘  │
│           ┌─────────────────────────────────────────┐       │
│           │    BottomChat (command interface)       │       │
│           │    (tabs + message log + input)         │       │
│           └─────────────────────────────────────────┘       │
├─────────────────────────────────────────────────────────────┤
│                        Tauri 2 Backend                      │
├─────────────────────────────────────────────────────────────┤
│  State: Zustand     3D: Three.js     Animations: Framer    │
│  Graph: Custom SVG  Effects: Canvas  UI: React + Tailwind  │
└─────────────────────────────────────────────────────────────┘
```

---\n

## Roadmap

|| Phase | Status | Description |
||-------|--------|-------------|
|| **Phase 1** | ✅ Complete | Cyberpunk UI/UX overhaul, orbital agent network, holographic avatar, telemetry panel |
|| **Phase 2** | 🔄 In Progress | Real Hermes AI integration via Docker bridge, Ollama local model support |
|| **Phase 3** | ⏳ Planned | Avatar expression sync with voice, advanced particle systems, memory visualization |
|| **Phase 4** | ⏳ Planned | Live2D avatar, multi-agent orchestration, autonomous task execution chains |

---\n

## License

MIT — see [LICENSE](LICENSE) for details.

---\n

*Last updated: May 29, 2026*
