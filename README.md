# HERMES — Cybernetic Intelligence Interface v2.0

> *"I'm not a chatbot. I'm your onboard AI."*

A cyberpunk tactical AI command interface desktop app with holographic avatar, orbital agent network, and real-time telemetry — built with Tauri 2, React 18, and TypeScript.

![HERMES](https://img.shields.io/badge/HERMES-v2.0-00dcff?style=flat-square)
![Tauri](https://img.shields.io/badge/Tauri-2.0-00bbdd?style=flat-square)
![React](https://img.shields.io/badge/React-18-00dcff?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-00bbdd?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Windows-00dcff?style=flat-square)

---

## Download & Install

### Windows (One-Click)

1. **Download** → [Hermes_2.0.0_x64-setup.exe](https://github.com/DonCarlos909/live_hermes/releases/download/v2.0.0/Hermes_2.0.0_x64-setup.exe) (5.7 MB)
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

# Cross-compile for Windows from Linux
npm run tauri build -- --target x86_64-pc-windows-gnu
```

---

## Connect to Hermes Agent (Real AI)

By default, the app runs in demo mode with simulated responses. To connect to the real Hermes Agent:

1. Open **Settings** (sidebar) → **Hermes** tab
2. Click **GENERATE** to create an API key
3. Give this key to Hermes Agent (via Discord `@Atlas` or setup)
4. Hermes Agent registers your app as authorized
5. Click **TEST CONNECTION** to verify
6. Once connected (**LIVE**), all chat responses come from real Hermes AI

### How It Works

```
┌──────────────────────────┐     API Key + HTTPS     ┌──────────────────────┐
│  HERMES Desktop App       │ ◄──────────────────────► │  Hermes Agent        │
│  (Windows / Tauri)        │   Authorization:        │  (Discord / Cloud)   │
│                           │   Bearer hmk_xxxx       │                      │
│  ┌─────────────────────┐  │                         │  ┌────────────────┐  │
│  │ Chat → POST /api/chat│─┘                         │  │ AI Response    │  │
│  └─────────────────────┘                            │  └────────────────┘  │
└──────────────────────────┘                          └──────────────────────┘
```

---

## Interface Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ≡ HERMES v2.0    ● ONLINE    IDLE MODE    AGENTS: RECON | CODE | CTF  │
├────────────┬────────────────────────────────────────────┬────────────────┤
│            │                                            │                │
│  AGENTS    │           ◉ HERMES AVATAR CORE            │  TELEMETRY     │
│  MEMORY    │        (orbital ring with arms)           │  CPU    23%    │
│  TOOLS     │     ←◄──── horizontal arm ────►→         │  MEM    67%    │
│  TASKS     │                                            │  NET    45%    │
│  SETTINGS  │           ● IDLE (pulse)                   │  DISK   12%    │
├────────────┴────────────────────────────────────────────┴────────────────┤
│  ▷ CHAT  │ TACTICAL │ CODING │ CTF │ RESEARCH │ AUTO │                  │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ [SYS]   HERMES v2.0 initialized. All systems nominal.            │   │
│  │ HERMES ▶ Welcome, Operator. All subsystems online.               │   │
│  │ USER   ▶ Initiate reconnaissance scan.                           │   │
│  │ HERMES ▶ Acknowledged. Processing request...                     │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│  ▶  Enter command...                                          [≡] [◄►] │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Features

- **Holographic Avatar** — AI face with idle/speaking/thinking/listening states, orbital ring with horizontal arms, floating particles
- **Orbital Agent Network** — Circular bubble map: HERMES at center, satellite agents on elliptical orbit with connector lines
- **Streaming Chat** — Typewriter effect, mode-based responses, 6 chat themes, custom scrollbars
- **Telemetry Panel** — Real-time system metrics with horizontal progress bars
- **Mode System** — CHAT / TACTICAL / CODING / CTF / RESEARCH / AUTO — each with unique color
- **Agent Connection** — Generate API key → authorize with Hermes Agent → real AI responses
- **Hologram FX** — Scanlines, vignette, glow effects
- **Memory & Tools Panels** — Neural network visualization, tool activation grid
- **Task Tracking** — Agent-specific tasks with progress indicators

---

## Chat Modes

| Mode | Color | Purpose |
|------|-------|---------|
| CHAT | Cyan `#00dcff` | General conversation |
| TACTICAL | Violet `#8b5cf6` | Mission planning |
| CODING | Teal `#00bbdd` | Code generation & review |
| CTF | Red `#ff2d55` | Security challenges |
| RESEARCH | White `#c8d8e8` | Deep research & sources |
| AUTO | Amber `#f0a020` | Autonomous multi-agent |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Shell | Tauri 2 (Rust) |
| Frontend | React 18 + Vite 6 + TypeScript 5.6 |
| Styling | Tailwind CSS 4 + custom CSS variables |
| State | Zustand 5 |
| Animations | Framer Motion 11 |
| Icons | Lucide React |
| Fonts | Orbitron + Share Tech Mono |

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-void` | `#020508` | Window background |
| `--bg-panel` | `#060b14` | Panel surfaces |
| `--bg-surface` | `#091018` | Chat/input backgrounds |
| `--border-panel` | `#0e1e30` | Panel borders |
| `--cyan` | `#00dcff` | Primary accent |
| `--cyan-dim` | `#007a94` | Inactive/dashed elements |
| `--green` | `#00e876` | Online status |
| `--amber` | `#f0a020` | System alerts |
| `--red` | `#ff2d55` | Critical/error |
| `--text-0` | `#e4f0ff` | Primary text |
| `--text-1` | `#8aaccc` | Secondary text |
| `--text-2` | `#3d6080` | Muted labels |

---

## Project Structure

```
live_hermes/
├── src-tauri/                   # Tauri Rust backend
│   ├── src/lib.rs               # Commands: test_connection, check_ollama, etc.
│   ├── tauri.conf.json          # Window config, bundle settings
│   └── Cargo.toml
├── src/
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Root layout (4-zone grid)
│   ├── index.css                # Theme, scrollbars, animations
│   ├── store/
│   │   ├── hermes.ts            # Zustand store (state + demo data)
│   │   └── types.ts             # TypeScript interfaces
│   └── components/
│       ├── layout/
│       │   ├── TopBar.tsx       # Status bar with logo, mode, agents
│       │   ├── LeftPanel.tsx    # Sidebar tabs
│       │   ├── MainArea.tsx     # Avatar + starfield
│       │   └── RightPanel.tsx   # Telemetry readouts
│       ├── chat/
│       │   └── BottomChat.tsx   # Streaming chat + input
│       ├── avatar/
│       │   ├── AvatarCore.tsx   # Face + orbital ring + particles
│       │   └── avatar.css
│       ├── bubble/
│       │   └── OrbitalBubbleMap.tsx  # Agent network diagram
│       ├── sidebar/
│       │   ├── SettingsPanel.tsx    # LLM, Ollama, Hermes, Guide
│       │   ├── MemoryPanel.tsx      # Neural memory map
│       │   ├── ToolsPanel.tsx       # Tool activation grid
│       │   └── TasksPanel.tsx       # Task list
│       ├── effects/
│       │   └── HologramEffects.tsx  # Scanlines, vignette
│       └── mode/
│           └── ModeSystem.tsx       # Mode overlays
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend — React + Vite + Tailwind v4                     │
│  ┌──────────┬──────────────┬──────────────┬──────────────┐  │
│  │  TopBar  │  LeftPanel   │  MainArea    │  RightPanel  │  │
│  │          │  (sidebar)   │  (avatar)    │  (telemetry) │  │
│  │          │              ├──────────────┤              │  │
│  │          │              │  BottomChat  │              │  │
│  └──────────┴──────────────┴──────────────┴──────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  Tauri 2 Backend — Rust                                     │
│  Commands: test_connection, check_ollama, pull_model,       │
│            check_docker, start_hermes_container             │
├─────────────────────────────────────────────────────────────┤
│  State: Zustand │ Animations: Framer Motion                │
│  Effects: Canvas │ Graph: Custom SVG                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 1** | ✅ Complete | UI/UX overhaul, orbital agents, holographic avatar, telemetry |
| **Phase 2** | ✅ Complete | API key auth, Hermes Agent connection, scroll/color fixes |
| **Phase 3** | 🔄 In Progress | Real-time AI streaming, Ollama local models |
| **Phase 4** | ⏳ Planned | Live2D avatar, multi-agent orchestration |

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Last updated: May 29, 2026*
