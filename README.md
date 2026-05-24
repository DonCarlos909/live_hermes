# HERMES — Live Cybernetic Intelligence

> *"I'm not a chatbot. I'm your onboard AI."*

A cyberpunk-themed AI companion desktop app with an animated avatar, agent orchestration, holographic interface, and 3D particle backgrounds — built with Tauri 2, React 18, and Three.js.

![HERMES](https://img.shields.io/badge/HERMES-v1.0-00d4ff?style=flat-square)
![Tauri](https://img.shields.io/badge/Tauri-2.0-22d3ee?style=flat-square)
![React](https://img.shields.io/badge/React-18-00d4ff?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-22d3ee?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Windows-00d4ff?style=flat-square)

---

## Download & Install

### Windows (One-Click)

1. **Download** → [Hermes_1.0.0_x64-setup.exe](https://github.com/DonCarlos909/live_hermes/releases/download/v1.0.0/Hermes_1.0.0_x64-setup.exe) (4.9 MB)
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

---

## Features

| Feature | Description |
|---------|-------------|
| 🎭 **Animated Avatar** | AI face with idle / speaking / thinking / listening states, glow ring, floating particles |
| 🌌 **3D Background** | 2000+ floating particles, energy waves, digital rain via Three.js |
| 💬 **Streaming Chat** | Typewriter text effect, glowing cursor, 6 chat modes |
| 🕸️ **Agent Network** | D3.js force-directed graph — agents, task counts, live connections |
| 🎨 **Mode System** | Idle, Analysis, CTF, Coding, Voice — each with a unique visual theme |
| ✨ **Hologram FX** | Scanlines, vignette, chromatic aberration, random glitch effects |
| 🧠 **Memory Panel** | Neural network visualization of memory nodes |
| 🛠️ **Tool Panel** | Holographic tool activation grid |
| 📋 **Task Panel** | Live task tracking per agent with progress bars |

---

## Interface Layout

```
┌──────────────────────────────────────────────────────────────┐
│  ≡ HERMES v1.0    ● ONLINE    IDLE MODE    AGENTS: ANALYSIS | CTF | + VOICE ▼  │
├────────────┬──────────────────────────────────┬──────────────┤
│            │                                  │              │
│  AGENTS    │        ┌──────────────┐          │  TELEMETRY   │
│  MEMORY    │        │  ● HERMES    │ ←Avatar  │  ─────────── │
│  TOOLS     │        │   AVATAR     │  (float) │  ══════════  │
│  TASKS     │        └──────────────┘          │  ─────────── │
│  FILES     │              ● IDLE              │  ══  ██  ══  │
│            │                                  │              │
├────────────┴──────────────────────────────────┴──────────────┤
│  ▷ CHAT  │  TACTICAL  │  CODING  │  CTF  │  RESEARCH  │  AUTO │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [SYS]   SYSTEM DIAGNOSTICS COMPLETE.                   │  │
│  │ HERMES ▶ All systems nominal. Awaiting your command.   │  │
│  │ USER   ▶ Initiate reconnaissance scan.                  │  │
│  └────────────────────────────────────────────────────────┘  │
│  ▶  Enter command...                              [≈]  [◄►]  │
└──────────────────────────────────────────────────────────────┘
```

---

## Chat Modes

| Mode | Accent | Purpose |
|------|--------|---------|
| CHAT | 🔵 Neon Blue | General conversation |
| TACTICAL | 🟣 Violet | Mission & task planning |
| CODING | 🟩 Cyan | Code generation & review |
| CTF | 🔴 Red | Security / capture-the-flag |
| RESEARCH | ⬜ White | Deep research & web retrieval |
| AUTO | 🟡 Yellow | Autonomous multi-agent execution |

## Operational Modes

| Mode | Visual Effect |
|------|--------------|
| **IDLE** | Soft blue glow, slow ambient particles |
| **ANALYSIS** | Blue tactical overlays, data streams |
| **CTF** | Red accents, aggressive animations, scanlines |
| **CODING** | Terminal-heavy, matrix rain overlay |
| **VOICE** | Avatar enlarged, UI minimized |

---

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
| Fonts | Orbitron + Share Tech Mono |

---

## Color Palette

| Role | Name | Hex |
|------|------|-----|
| Primary | Neon Blue | `#00d4ff` |
| Primary | Deep Black | `#0a0a0f` |
| Accent | Crimson Red | `#ff2d55` |
| Accent | Violet Glow | `#8b5cf6` |
| Energy | Cyan Energy | `#22d3ee` |
| Highlight | White | `#f0f0ff` |

---

## Project Structure

```
live_hermes/
├── src-tauri/                    # Tauri Rust backend
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── capabilities/
│   │   └── default.json
│   ├── icons/                    # App icons (32, 128, 256, ICO, ICNS)
│   └── src/
│       ├── main.rs
│       └── lib.rs
├── src/
│   ├── main.tsx                  # Entry point
│   ├── App.tsx                   # Root layout
│   ├── index.css                 # Tailwind + theme + animations
│   ├── store/
│   │   ├── hermes.ts             # Zustand store (state + demo data)
│   │   └── types.ts              # TypeScript interfaces
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopBar.tsx        # Status bar with Hermes icon
│   │   │   ├── LeftPanel.tsx     # Sidebar with tabs
│   │   │   └── MainArea.tsx      # Avatar + 3D background
│   │   ├── avatar/
│   │   │   ├── AvatarCore.tsx    # Face + particle ring
│   │   │   └── avatar.css        # Glow ring, scanline, float
│   │   ├── background/
│   │   │   └── CyberBackground.tsx  # Three.js particles, waves, rain
│   │   ├── chat/
│   │   │   └── BottomChat.tsx    # Streaming chat + mode selector
│   │   ├── sidebar/
│   │   │   ├── AgentsPanel.tsx   # D3 force-directed agent graph
│   │   │   ├── MemoryPanel.tsx   # Neural memory map
│   │   │   ├── ToolsPanel.tsx    # Tool activation grid
│   │   │   └── TasksPanel.tsx    # Task list with progress bars
│   │   ├── effects/
│   │   │   └── HologramEffects.tsx  # Scanlines, glitch, vignette
│   │   └── mode/
│   │       └── ModeSystem.tsx    # Mode switching + overlays
│   └── assets/
│       └── avatar/
│           ├── hermes-face.jpg   # Square crop for TopBar icon
│           └── hermes-circle.png # Circular crop (transparent bg)
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── postcss.config.js
```

---

## Architecture

```
┌────────────────────────────────────────────┐
│   Frontend — React + Vite + Tailwind v4    │
│  ┌──────────┬─────────────┬─────────────┐  │
│  │  TopBar  │  LeftPanel  │  MainArea   │  │
│  │          │  (tabs)     │  3D + Avatar│  │
│  │          │             ├─────────────┤  │
│  │          │             │  BottomChat │  │
│  └──────────┴─────────────┴─────────────┘  │
├────────────────────────────────────────────┤
│   Tauri 2 Backend — Rust                   │
├────────────────────────────────────────────┤
│   State: Zustand                           │
│   3D: Three.js / @react-three/fiber        │
│   Graph: D3.js force-directed              │
│   Animations: Framer Motion                │
└────────────────────────────────────────────┘
```

---

## Roadmap

- **Phase 1** ✅ — Scaffold, avatar, streaming chat, agent graph, hologram FX, Windows installer
- **Phase 2** 🔄 — Live lip sync (LivePortrait), particle system upgrades, memory visualization
- **Phase 3** 📋 — Live2D avatar, multi-agent orchestration, autonomous task execution

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

# How to Build a Project Like HERMES — Step-by-Step Guide

This section walks you through every decision and step needed to build a cyberpunk AI companion desktop app from scratch, using the same stack as HERMES.

---

## Step 0 — Prerequisites

Install these before starting:

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20+ | https://nodejs.org |
| Rust | stable | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| Tauri CLI | 2.x | `cargo install tauri-cli` |
| VS Code | latest | https://code.visualstudio.com |

VS Code extensions to install:
- Rust Analyzer
- Tailwind CSS IntelliSense
- ESLint + Prettier

---

## Step 1 — Scaffold the Project

Use the official Tauri + React + TypeScript template:

```bash
npm create tauri-app@latest live_hermes
# Choose: React → TypeScript → Vite
cd live_hermes
npm install
```

This creates both the `src/` React frontend and `src-tauri/` Rust backend in one repo.

Verify it works:
```bash
npm run tauri dev
# A blank window should open
```

---

## Step 2 — Install All Dependencies

```bash
# Styling
npm install tailwindcss@4 postcss autoprefixer

# 3D background
npm install three @react-three/fiber @react-three/drei

# Agent graph
npm install d3

# State management
npm install zustand

# Animations
npm install framer-motion

# Icons
npm install lucide-react

# Type definitions
npm install -D @types/three @types/d3
```

Add Google Fonts to `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
```

---

## Step 3 — Configure Tailwind v4

Create `postcss.config.js`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

In `src/index.css`, set your cyberpunk theme variables at the top:
```css
@import "tailwindcss";

:root {
  --bg-void: #040810;
  --bg-panel: #070d18;
  --bg-surface: #0a1220;
  --cyan: #00e5ff;
  --cyan-dim: #0099aa;
  --cyan-glow: rgba(0, 229, 255, 0.15);
  --green-online: #39ff6a;
  --amber: #ffaa00;
  --red-alert: #ff2d55;
  --text-p: #d8eeff;
  --text-s: #4a7a90;
  --font-display: 'Orbitron', sans-serif;
  --font-mono: 'Share Tech Mono', monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: var(--bg-void);
  color: var(--text-p);
  font-family: var(--font-mono);
  overflow: hidden;
}
```

---

## Step 4 — Build the Layout (App.tsx)

The entire app is a fixed-height grid — no scrolling at the window level:

```tsx
// src/App.tsx
import TopBar from './components/layout/TopBar'
import LeftPanel from './components/layout/LeftPanel'
import MainArea from './components/layout/MainArea'
import BottomChat from './components/chat/BottomChat'

export default function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden"
         style={{ background: 'var(--bg-void)' }}>
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <MainArea />
        {/* Optional: RightPanel for telemetry */}
      </div>
      <BottomChat />
    </div>
  )
}
```

---

## Step 5 — Build the TopBar

```tsx
// src/components/layout/TopBar.tsx
export default function TopBar() {
  return (
    <div style={{
      height: 48,
      background: 'var(--bg-panel)',
      borderBottom: '1px solid rgba(0,229,255,0.15)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 12,
      fontFamily: 'var(--font-display)',
    }}>
      {/* Logo */}
      <span style={{ color: 'var(--cyan)', fontSize: 16, fontWeight: 900,
                     textShadow: '0 0 14px #00e5ff', letterSpacing: '0.12em' }}>
        HERMES
      </span>
      <span style={{ color: 'var(--text-s)', fontSize: 11 }}>v1.0</span>

      {/* Online dot */}
      <div style={{ width: 7, height: 7, borderRadius: '50%',
                    background: 'var(--green-online)',
                    boxShadow: '0 0 8px #39ff6a',
                    animation: 'pulse 2s infinite' }} />
      <span style={{ color: 'var(--green-online)', fontSize: 11, letterSpacing: '0.1em' }}>
        ONLINE
      </span>

      <div style={{ flex: 1 }} />

      {/* Mode + agent pills on the right */}
      <span style={{ color: 'var(--text-p)', fontSize: 12, letterSpacing: '0.1em' }}>
        IDLE MODE
      </span>
    </div>
  )
}
```

Add the `pulse` keyframe in `index.css`:
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
```

---

## Step 6 — Build the Left Panel (Agents Tab)

The agent network is a D3.js force-directed graph rendered in an SVG:

```tsx
// src/components/sidebar/AgentsPanel.tsx
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const nodes = [
  { id: 'HERMES', tasks: 1, active: true },
  { id: 'Recon',  tasks: 2, active: true },
  { id: 'Code',   tasks: 3, active: true },
  { id: 'CTF',    tasks: 0, active: false },
]
const links = [
  { source: 'HERMES', target: 'Recon' },
  { source: 'HERMES', target: 'Code' },
  { source: 'HERMES', target: 'CTF' },
]

export default function AgentsPanel() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    const width = 220, height = 200

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(70))
      .force('charge', d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(width / 2, height / 2))

    // Draw links
    const link = svg.selectAll('line').data(links).join('line')
      .attr('stroke', '#0099aa')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4 4')

    // Draw nodes
    const node = svg.selectAll('circle').data(nodes as any).join('circle')
      .attr('r', (d: any) => d.id === 'HERMES' ? 28 : 18)
      .attr('fill', '#080e1a')
      .attr('stroke', (d: any) => d.active ? '#00e5ff' : '#1a3040')
      .attr('stroke-width', 1.5)

    // Labels
    const label = svg.selectAll('text').data(nodes as any).join('text')
      .text((d: any) => d.id)
      .attr('fill', '#00e5ff')
      .attr('font-size', 9)
      .attr('font-family', 'Orbitron')
      .attr('text-anchor', 'middle')
      .attr('dy', 3)

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)
      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)
      label.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y)
    })

    return () => { simulation.stop() }
  }, [])

  return <svg ref={svgRef} width="100%" height={200} />
}
```

---

## Step 7 — Build the Avatar Core

```tsx
// src/components/avatar/AvatarCore.tsx
import hermesImg from '../../assets/avatar/hermes-circle.png'

export default function AvatarCore() {
  return (
    <div style={{ position: 'relative', width: 280, height: 280,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* Outer rotating arc ring (SVG) */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%' }}
           viewBox="0 0 280 280">
        <g style={{ transformOrigin: '140px 140px', animation: 'rotate 6s linear infinite' }}>
          <path d="M140,20 A120,120 0 0,1 260,140"
                fill="none" stroke="#00e5ff" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="140" cy="20" r="4" fill="#00e5ff"/>
        </g>
        <circle cx="140" cy="140" r="125" fill="none"
                stroke="rgba(0,229,255,0.1)" strokeWidth="1"/>
      </svg>

      {/* Avatar circle */}
      <div style={{
        width: 210, height: 210, borderRadius: '50%', overflow: 'hidden',
        border: '2px solid rgba(0,229,255,0.5)',
        boxShadow: '0 0 40px rgba(0,229,255,0.2), inset 0 0 20px rgba(0,229,255,0.08)',
        animation: 'float 5s ease-in-out infinite',
      }}>
        <img src={hermesImg} alt="HERMES"
             style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
      </div>

      {/* Status label */}
      <div style={{
        position: 'absolute', bottom: -28,
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'Orbitron', fontSize: 12, color: '#00e5ff',
        letterSpacing: '0.2em',
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%',
                      background: '#00e5ff', animation: 'pulse 2s infinite' }}/>
        IDLE
      </div>
    </div>
  )
}
```

Add to `index.css`:
```css
@keyframes rotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}
```

---

## Step 8 — Build the 3D Background (Three.js)

```tsx
// src/components/background/CyberBackground.tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function Particles({ count = 2000 }) {
  const mesh = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 0.05
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position"
          args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#00e5ff" transparent opacity={0.6}/>
    </points>
  )
}

export default function CyberBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <ambientLight intensity={0.1}/>
        <Particles />
      </Canvas>
    </div>
  )
}
```

---

## Step 9 — Build the Chat Interface

```tsx
// src/components/chat/BottomChat.tsx
import { useState } from 'react'

const TABS = ['CHAT', 'TACTICAL', 'CODING', 'CTF', 'RESEARCH', 'AUTO']

export default function BottomChat() {
  const [activeTab, setActiveTab] = useState('CHAT')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { type: 'sys',    text: 'SYSTEM DIAGNOSTICS COMPLETE.' },
    { type: 'hermes', text: 'All systems nominal. Awaiting your command.' },
  ])

  const send = () => {
    if (!input.trim()) return
    setMessages(m => [...m,
      { type: 'user', text: input },
      { type: 'hermes', text: 'Command received. Processing...' }
    ])
    setInput('')
  }

  return (
    <div style={{ background: 'var(--bg-panel)',
                  borderTop: '1px solid rgba(0,229,255,0.15)' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,229,255,0.1)' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: 11, letterSpacing: '0.1em',
              color: activeTab === tab ? 'var(--cyan)' : 'var(--text-s)',
              borderBottom: activeTab === tab ? '2px solid var(--cyan)' : '2px solid transparent',
              background: 'none', border: 'none', cursor: 'pointer',
            }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ padding: '10px 16px', minHeight: 80, maxHeight: 120, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 6, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: m.type === 'sys' ? '#e8a020'
                                : m.type === 'hermes' ? 'var(--cyan)' : '#ffffff',
                           fontWeight: 700, marginRight: 8 }}>
              {m.type === 'sys' ? '[SYS]' : m.type === 'hermes' ? 'HERMES ▶' : 'USER ▶'}
            </span>
            <span style={{ color: 'var(--text-p)' }}>{m.text}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 14px',
                    borderTop: '1px solid rgba(0,229,255,0.1)' }}>
        <span style={{ color: 'var(--cyan)', fontSize: 16 }}>▶</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Enter command..."
          style={{
            flex: 1, background: 'var(--bg-surface)',
            border: '1px solid rgba(0,229,255,0.2)',
            borderRadius: 4, padding: '7px 12px',
            color: 'var(--text-p)', fontFamily: 'var(--font-mono)',
            fontSize: 12, outline: 'none',
          }}
        />
        <button onClick={send} style={{
          background: 'rgba(0,229,255,0.1)',
          border: '1px solid var(--cyan-dim)',
          borderRadius: 4, padding: '6px 12px',
          color: 'var(--cyan)', cursor: 'pointer',
        }}>
          →
        </button>
      </div>
    </div>
  )
}
```

---

## Step 10 — Add Hologram Effects (Scanlines)

```tsx
// src/components/effects/HologramEffects.tsx
export default function HologramEffects() {
  return (
    <>
      {/* Scanlines overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 998,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
      }} />
    </>
  )
}
```

Add this inside `App.tsx` at the root level.

---

## Step 11 — Zustand State Store

```ts
// src/store/hermes.ts
import { create } from 'zustand'

interface HermesState {
  mode: 'idle' | 'analysis' | 'ctf' | 'coding' | 'voice'
  avatarState: 'idle' | 'speaking' | 'thinking' | 'listening'
  agents: { id: string; tasks: number; active: boolean }[]
  setMode: (mode: HermesState['mode']) => void
  setAvatarState: (s: HermesState['avatarState']) => void
}

export const useHermes = create<HermesState>(set => ({
  mode: 'idle',
  avatarState: 'idle',
  agents: [
    { id: 'HERMES', tasks: 1, active: true },
    { id: 'Recon',  tasks: 2, active: true },
    { id: 'Code',   tasks: 3, active: true },
    { id: 'CTF',    tasks: 0, active: false },
  ],
  setMode: mode => set({ mode }),
  setAvatarState: avatarState => set({ avatarState }),
}))
```

---

## Step 12 — Configure Tauri Window

Edit `src-tauri/tauri.conf.json` to give the app a borderless cyberpunk window feel:

```json
{
  "tauri": {
    "windows": [{
      "title": "HERMES — Cybernetic Intelligence",
      "width": 1280,
      "height": 800,
      "minWidth": 1024,
      "minHeight": 680,
      "decorations": true,
      "resizable": true,
      "center": true
    }]
  }
}
```

For a fully custom titlebar (no OS chrome), set `"decorations": false` and build your own topbar close/minimize buttons using Tauri's window API:

```ts
import { getCurrentWindow } from '@tauri-apps/api/window'
const win = getCurrentWindow()
win.close()
win.minimize()
win.toggleMaximize()
```

---

## Step 13 — Build the Windows Installer

```bash
npm run tauri build
```

Output: `src-tauri/target/release/bundle/nsis/Hermes_1.0.0_x64-setup.exe`

Upload this file to your GitHub Releases page.

> For code signing (removes SmartScreen warning): you need a purchased EV code-signing certificate from DigiCert or Sectigo. For open-source projects, leave unsigned and document the SmartScreen workaround in your README.

---

## Step 14 — Add Your Avatar Image

Prepare two versions of the avatar:

| File | Use | Spec |
|------|-----|------|
| `hermes-face.jpg` | TopBar icon | 64×64px, square crop, face centered |
| `hermes-circle.png` | Avatar Core | 512×512px, circular mask with transparency |

Place both in `src/assets/avatar/`. Import them in components:

```ts
import hermesCircle from '../../assets/avatar/hermes-circle.png'
```

Vite handles image imports automatically — no extra config needed.

---

## Step 15 — GitHub Setup

Initialize and push:

```bash
git init
git add .
git commit -m "feat: HERMES v1.0 initial commit"
git remote add origin https://github.com/YOUR_USERNAME/live_hermes.git
git push -u origin main
```

Create your first release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Then on GitHub: **Releases → Create release → v1.0.0 → Upload .exe installer → Publish**.

Copy the direct download URL to your README badge link.

---

## Checklist: Everything Done Before v1.0 Release

- [ ] `npm run tauri build` completes without errors
- [ ] App opens and renders in the Tauri window
- [ ] Topbar shows HERMES logo, online status, mode pills
- [ ] Left panel renders agent bubble graph
- [ ] Avatar renders with floating animation and orbital ring
- [ ] 3D particle background renders behind avatar
- [ ] Chat tabs switch correctly
- [ ] Messages display with correct color coding
- [ ] Command input sends and receives response
- [ ] Scanlines + vignette overlay visible
- [ ] Windows installer file generated
- [ ] GitHub repo public with README and release
- [ ] Screenshot or preview image in README

---

*HERMES — Build Guide v1.0 · MIT License*
