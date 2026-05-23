# HERMES — Live Cybernetic Intelligence

> *"I'm not a chatbot. I'm your onboard AI."*

A cyberpunk-themed AI companion GUI built with Tauri 2, React, Three.js, and D3.js.

![Hermes](https://img.shields.io/badge/HERMES-v1.0-00d4ff?style=flat-square)
![Tauri](https://img.shields.io/badge/Tauri-2.0-22d3ee?style=flat-square)
![React](https://img.shields.io/badge/React-18-00d4ff?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-22d3ee?style=flat-square)

## Features

- **🎭 Animated Avatar** — Canvas-rendered avatar with idle/speaking/thinking/listening states
- **🌌 Three.js Background** — 2000+ floating particles, energy waves, digital rain
- **💬 Streaming Chat** — Typewriter text effect, glowing cursor, 6 chat modes
- **🕸️ Agent Network** — D3.js force-directed graph showing agents, tasks, connections
- **🎨 Mode System** — Idle, Analysis, CTF, Coding, Voice with theme switching
- **✨ Hologram Effects** — Scanlines, vignette, chromatic aberration, random glitch
- **🧠 Memory Panel** — Neural network visualization of memory nodes
- **🛠️ Tool Panel** — Holographic tool activation UI

## Quick Start

```bash
# Install dependencies
npm install

# Development (web only)
npm run dev

# Development (Tauri desktop app)
npm run tauri dev

# Build for production
npm run tauri build
```

## Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (React + Vite + Tailwind v4)  │
│  ┌─────────┬──────────┬───────────────┐ │
│  │ TopBar  │ LeftPanel│  MainArea     │ │
│  │         │ (tabs)   │  (3D + Avatar)│ │
│  │         │          ├───────────────┤ │
│  │         │          │  BottomChat   │ │
│  └─────────┴──────────┴───────────────┘ │
├─────────────────────────────────────────┤
│  Tauri 2 Backend (Rust)                 │
├─────────────────────────────────────────┤
│  State: Zustand                         │
│  3D: Three.js (@react-three/fiber)      │
│  Graph: D3.js force-directed            │
│  Animations: Framer Motion              │
└─────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Shell | Tauri 2 (Rust) |
| Frontend | React 18 + Vite 6 + TypeScript 5.6 |
| Styling | Tailwind CSS 4 + custom CSS |
| 3D | Three.js + @react-three/fiber + drei |
| Graph | D3.js force-directed |
| State | Zustand 5 |
| Animations | Framer Motion 11 |
| Icons | Lucide React |

## Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Primary | Neon Blue | `#00d4ff` |
| Primary | Crimson Red | `#ff2d55` |
| Primary | Deep Black | `#0a0a0f` |
| Secondary | Violet Glow | `#8b5cf6` |
| Secondary | Cyan Energy | `#22d3ee` |
| Secondary | White Highlight | `#f0f0ff` |

## Project Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Root layout
├── index.css                   # Tailwind + theme + animations
├── store/
│   ├── hermes.ts               # Zustand store (state + demo data)
│   └── types.ts                # TypeScript interfaces
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx          # Status bar
│   │   ├── LeftPanel.tsx       # Sidebar with tabs
│   │   └── MainArea.tsx        # Avatar + 3D background
│   ├── avatar/
│   │   ├── AvatarCore.tsx      # Canvas-rendered avatar
│   │   └── avatar.css          # Avatar animations
│   ├── background/
│   │   └── CyberBackground.tsx # Three.js scene
│   ├── chat/
│   │   └── BottomChat.tsx      # Chat panel + mode selector
│   ├── sidebar/
│   │   ├── AgentsPanel.tsx     # D3 agent network graph
│   │   ├── MemoryPanel.tsx     # Memory neural map
│   │   ├── ToolsPanel.tsx      # Tool grid
│   │   └── TasksPanel.tsx      # Task list
│   ├── effects/
│   │   └── HologramEffects.tsx # Scanlines, glitch, vignette
│   └── mode/
│       └── ModeSystem.tsx      # Mode switching + overlays
└── assets/
    └── avatar/                 # Avatar images (Phase 2)
```

## Roadmap

- **Phase 1** ✅ — Scaffold, avatar, chat, agents, effects
- **Phase 2** — Live lip sync (LivePortrait), particle system upgrades, memory visualization
- **Phase 3** — Live2D avatar, multi-agent orchestration, autonomous systems

## License

MIT
