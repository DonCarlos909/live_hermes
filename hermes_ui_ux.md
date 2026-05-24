# HERMES — Cybernetic Intelligence UI/UX Specification
**Version 1.0 · Design System Document**

---

## 1. Design Philosophy

HERMES is a cybernetic AI command interface — not a chatbot. The visual language should communicate **operational authority**: a system that is always-on, aware, and capable. Every element reinforces the feeling that the operator is commanding a live intelligence network.

**Core Aesthetic Direction:** *Cyberpunk Tactical Terminal* — dark, high-contrast, neon-accented, monospace-meets-holographic. Inspired by military SIGINT dashboards crossed with sci-fi AI companion interfaces.

**Design Pillars:**
- **Presence** — The avatar is the soul of the interface. She must feel alive, not decorative.
- **Clarity under density** — A lot of information is visible at once; it must never feel cluttered.
- **Operational focus** — Every interaction is a command, every response is a transmission.
- **Depth** — Layers of glows, scanlines, and translucency create a sense of living depth.

---

## 2. Layout Architecture

The HERMES window is divided into **4 primary zones**:

```
┌──────────────────────────────────────────────────────────┐
│  ZONE 1 — TOPBAR (Status & Navigation)                   │
│  HERMES v1.0 · ONLINE ─── IDLE MODE ─── AGENT NETWORK   │
├──────────────┬───────────────────────────────────────────┤
│              │                                           │
│  ZONE 2      │  ZONE 4 — AVATAR CORE                    │
│  AGENT PANEL │  (Hermes holographic avatar, centered)    │
│  (Network    │                                           │
│  bubbles,    ├───────────────────────────────────────────┤
│  active      │  ZONE 3 — COMMAND INTERFACE               │
│  agents)     │  [CHAT] [TACTICAL] [CODING] [CTF]         │
│              │  [SYS] log · HERMES response · Input bar  │
└──────────────┴───────────────────────────────────────────┘
```

### Zone Breakdown

| Zone | Purpose | Key Elements |
|------|---------|--------------|
| **1 — Topbar** | System status & global nav | Identity badge, mode indicator, agent count, mode tabs |
| **2 — Left Panel** | Agent network visualization | Orbital bubble graph, active agent list, task count |
| **3 — Command Interface** | Primary interaction surface | Mode tabs, message log, command input |
| **4 — Avatar Core** | HERMES presence & status | Holographic avatar, orbital ring, status pulse |

---

## 3. Color System

### Base Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-void` | `#050810` | Window background |
| `--bg-panel` | `#080e1a` | Panel surfaces |
| `--bg-surface` | `#0c1526` | Card / message surfaces |
| `--bg-input` | `#0a1220` | Input fields |
| `--cyan-primary` | `#00e5ff` | Primary accent, avatar ring, active states |
| `--cyan-dim` | `#0099aa` | Secondary accents, borders |
| `--cyan-glow` | `rgba(0,229,255,0.15)` | Glow halos |
| `--green-online` | `#39ff6a` | Online / success status |
| `--amber-warn` | `#ffaa00` | Warning states |
| `--red-alert` | `#ff3b5c` | Alert / danger |
| `--text-primary` | `#e0f4ff` | Main text |
| `--text-secondary` | `#5a8fa8` | Muted labels |
| `--text-mono` | `#00e5ff` | Terminal / code text |

### Usage Rules
- Never use pure white (#fff) — use `--text-primary` (slight blue tint)
- Neon accents are used **sparingly** — one dominant glow per section max
- Dark surfaces use `1px` borders in `--cyan-dim` at 30% opacity
- All interactive elements have a cyan glow on hover (`box-shadow: 0 0 12px var(--cyan-glow)`)

---

## 4. Typography

### Font Stack

| Role | Font | Weight | Size |
|------|------|--------|------|
| **Display / Logo** | `'Orbitron'` (Google Fonts) | 700 | 14–18px |
| **UI Labels** | `'Share Tech Mono'` | 400 | 11–13px |
| **Body / Chat** | `'Share Tech Mono'` | 400 | 13px |
| **System messages** | `'Share Tech Mono'` | 400 | 12px, color: `--text-secondary` |

### Text Rules
- All UI labels are **UPPERCASE** with `letter-spacing: 0.1em`
- Chat messages use natural case with `font-family: monospace`
- Timestamps and system tags use `[brackets]` notation
- Line height: `1.6` for readability in dense log view

---

## 5. Component Specifications

### 5.1 Topbar

**Height:** 48px  
**Layout:** `flex`, space-between  
**Background:** `--bg-panel` with bottom border `1px solid --cyan-dim`

Elements (left to right):
- **HERMES wordmark** — Orbitron Bold, `--cyan-primary`, 16px
- **Version badge** — `v1.0`, monospace, `--text-secondary`, 11px
- **Online indicator** — pulsing green dot + "ONLINE" label
- **Center:** Mode status (IDLE MODE / TRANSMITTING / PROCESSING)
- **Right:** Agent count badge + mode pills (IDLE · ANALYSIS · CTF · CODING · VOICE)

### 5.2 Left Panel — Agent Network

**Width:** 260px  
**Top section:** Icon navigation (Agents · Tools · Tasks · Files)  
**Middle section:** Orbital bubble visualization

Bubble Graph Rules:
- Central node = HERMES (always center, largest)
- Satellite nodes = active agents (CTF, Recon, Code, etc.)
- Connection lines = `1px`, `--cyan-dim`, dashed
- Active agents glow with `--cyan-primary` ring
- Node size scales with active task count

**Bottom section:** Task list
```
  Recon     2 tasks
  Code      3 tasks  
  CTF       idle
  Hermes    1 task
```

### 5.3 Avatar Core (Zone 4)

The emotional center of the interface. The avatar should feel **alive**.

**Avatar Container:**
- Circular crop with `border: 2px solid --cyan-primary`
- Outer ring: animated rotating arc segments
- Inner glow: radial `--cyan-glow` halo
- Background: starfield particle effect (CSS/canvas)

**Status Indicator:**
- Below avatar: `● TRANSMITTING` / `● IDLE` / `● PROCESSING`
- Color shifts with state: cyan → amber → green
- Pulsing dot animation at 1.5s interval

**Avatar States:**

| State | Visual Change |
|-------|--------------|
| IDLE | Soft slow pulse, dim ring |
| TRANSMITTING | Bright ring, fast pulse |
| PROCESSING | Rotating arc segments, amber tint |
| ALERT | Red ring flash, rapid pulse |

### 5.4 Command Interface (Zone 3)

**Tab Bar:**
- `[CHAT]` `[TACTICAL]` `[CODING]` `[CTF]` `[RESEARCH]` `[AUTO]`
- Active tab: `--cyan-primary` bottom border + text glow
- Inactive: `--text-secondary`

**Message Log:**
- Background: `--bg-surface`
- System messages: `[SYS]` prefix, amber text, 12px
- HERMES messages: `HERMES ▸` prefix, `--text-primary`
- User input: right-aligned, `--cyan-primary` text
- Scroll: custom thin scrollbar in `--cyan-dim`

**Command Input Bar:**
- Height: 44px
- Prompt: `>` in `--cyan-primary`
- Placeholder: `Enter command...`
- On focus: `box-shadow: 0 0 16px var(--cyan-glow)` border glow
- Send: Enter key or send icon button

---

## 6. Motion & Animation

### Principles
- All animations use `ease-in-out` or `cubic-bezier(0.4, 0, 0.2, 1)`
- No animations that distract from reading
- Avatar animations are continuous and subtle; UI animations are event-triggered

### Key Animations

| Element | Animation | Duration |
|---------|-----------|----------|
| Online dot | `pulse` opacity 1→0.4→1 | 2s loop |
| Avatar ring | Slow rotate + brightness pulse | 4s loop |
| Transmitting state | Fast ring spin | 0.8s loop |
| Tab switch | Fade + slide | 150ms |
| New message | Fade in from bottom | 200ms |
| Agent bubble (active) | Subtle scale 1→1.05→1 | 3s loop |
| Input focus | Border glow expand | 200ms |
| Mode change | Full crossfade | 300ms |

---

## 7. Interaction Patterns

### Command Input
- Type-ahead suggestions from command history
- Special prefixes: `/agent`, `/tool`, `/task`, `/mode`
- Tab-completion for agent names
- Up/down arrow = command history navigation

### Agent Panel
- Click agent bubble → highlight + show agent detail drawer
- Hover = tooltip with task list
- Double-click = open dedicated agent chat tab

### Avatar
- Click avatar = toggle HERMES focus mode (full-screen avatar + chat)
- Hover = subtle brightness increase
- Avatar animates when HERMES is actively generating a response

### Mode Tabs
- CHAT — general conversation
- TACTICAL — mission/task planning mode
- CODING — syntax-highlighted code execution context
- CTF — capture-the-flag / security challenge context
- RESEARCH — web retrieval mode
- AUTO — autonomous multi-agent task mode

---

## 8. Responsive Behavior

HERMES is a **desktop-first** application. Minimum window size: `1024 × 680px`.

| Breakpoint | Change |
|-----------|--------|
| < 1280px | Left panel collapses to icon-only (48px) |
| < 1024px | Avatar Core moves below chat; stacked layout |
| < 800px | Left panel hidden; toggle via hamburger |

---

## 9. Accessibility

- All interactive elements have visible focus states (cyan outline)
- Color is never the **only** indicator of state (paired with icon/text)
- Minimum contrast ratio: 4.5:1 for all text on dark backgrounds
- Keyboard navigable: Tab order follows visual reading order
- Screen reader: all agent bubbles have `aria-label`; status changes trigger `aria-live` announcements

---

## 10. Sound Design (Optional Layer)

| Event | Sound |
|-------|-------|
| System boot | Low synth chord + data burst |
| Message received | Soft digital chime |
| Alert | Sharp ping |
| Command sent | Subtle keystroke confirm |
| Mode switch | Whoosh transition |
| Agent activated | Activation tone |

All sounds are optional and toggled via settings. Default: **off**.

---

*HERMES UI/UX Specification — v1.0 — Confidential*
