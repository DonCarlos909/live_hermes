# HERMES — Cybernetic Intelligence UI/UX Specification
**Version 1.0 · Design System Document · Based on Rendered Interface**

---

## 1. Design Philosophy

HERMES is a cybernetic AI command interface — not a chatbot. The visual language communicates **operational authority**: a system that is always-on, aware, and capable. Every element reinforces the feeling that the operator is commanding a live intelligence network.

**Core Aesthetic Direction:** *Cyberpunk Tactical Terminal* — deep-black backgrounds, electric cyan neon accents, hard-edged panel borders, scanline overlays, and a central holographic AI avatar. Inspired by military SIGINT dashboards crossed with sci-fi AI companion interfaces.

**Design Pillars:**
- **Presence** — The avatar is the soul of the interface. She dominates the center stage, framed by a glowing orbital ring.
- **Clarity under density** — Multiple information panels are visible simultaneously without feeling cluttered.
- **Operational focus** — Every element is a functional control or status readout, nothing is decorative.
- **Depth** — Hard panel borders, glow halos, and a starfield background create layered visual depth.

---

## 2. Layout Architecture

The HERMES window uses a **3-column, 2-row grid** divided into 4 zones:

```
┌─────────────────────────────────────────────────────────────────┐
│  ZONE 1 — TOPBAR                                                │
│  ≡ HERMES v1.0  ●ONLINE  IDLE MODE  AGENTS: ANALYSIS | CTF | + VOICE ▼ │
├────────────────┬──────────────────────────┬─────────────────────┤
│                │                          │                     │
│  ZONE 2        │  ZONE 4 — AVATAR CORE    │  RIGHT PANEL        │
│  AGENT PANEL   │  (holographic avatar,    │  (data readouts,    │
│  - bubble map  │   orbital ring,          │   telemetry bars,   │
│  - task list   │   IDLE status below)     │   system metrics)   │
│                │                          │                     │
├────────────────┴──────────────────────────┴─────────────────────┤
│  ZONE 3 — COMMAND INTERFACE (full width)                        │
│  [CHAT] [TACTICAL] [CODING] [CTF] [RESEARCH] [AUTO]            │
│  [SYS] log · HERMES ▸ response · USER ▸ input · Enter command  │
└─────────────────────────────────────────────────────────────────┘
```

### Zone Breakdown

| Zone | Dimensions | Purpose | Key Elements |
|------|-----------|---------|--------------|
| **1 — Topbar** | Full width × 48px | Identity, status, mode nav | Logo, version, online dot, mode status, agent mode pills |
| **2 — Left Panel** | ~280px wide × upper 60% | Agent network | Header "AGENT PANEL · CTF", orbital bubble map, task list |
| **3 — Command Interface** | Full width × lower 30% | Primary interaction | Tab bar, 3-line message log, command input bar |
| **4 — Avatar Core** | Center column × upper 60% | HERMES presence | Avatar portrait, double orbital ring, starfield bg, status label |
| **5 — Right Panel** | ~280px wide × upper 60% | System telemetry | Data readout lines, horizontal progress bars, metrics |

---

## 3. Color System

All colors extracted directly from the rendered interface.

### Base Palette

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--bg-void` | `#040810` | Outermost window background, true near-black |
| `--bg-panel` | `#070d18` | Panel surfaces (left, right, bottom) |
| `--bg-surface` | `#0a1220` | Message log background, input field bg |
| `--border-panel` | `#0d2035` | Hard panel border lines (1–2px) |
| `--cyan-primary` | `#00e8ff` | Primary neon accent — avatar ring, active elements, logo |
| `--cyan-glow` | `rgba(0,232,255,0.18)` | Glow halo behind avatar, bubble nodes |
| `--cyan-dim` | `#006f88` | Dashed connector lines in bubble map, inactive borders |
| `--cyan-mid` | `#009ab5` | Secondary labels, dashed node rings |
| `--green-online` | `#00ff55` | Online status dot only |
| `--amber-sys` | `#e8a020` | [SYS] tag text color |
| `--text-primary` | `#d8eeff` | All body text, chat messages |
| `--text-secondary` | `#4a7a90` | Muted labels, idle agent text |
| `--text-cyan-label` | `#00c8e8` | HERMES tag, active nav labels |
| `--red-bar` | `#ff2244` | One accent bar in right panel (alert/critical metric) |

### Usage Rules
- Background layers always go darker outward → lighter inward (panel darker than avatar zone)
- Cyan neon is used at full brightness only on: avatar ring, HERMES logo, active tab, online status → everything else is dimmed cyan
- Panel borders are **hard, sharp** — `1–2px solid var(--border-panel)`, no border-radius on outer panels
- Inner components (bubbles, input bar) use `4px` border-radius max
- Glow effects are **additive** — `box-shadow` or `filter: drop-shadow` in cyan only

---

## 4. Typography

### Font Stack

| Role | Font | Weight | Size | Color |
|------|------|--------|------|-------|
| **Logo "HERMES"** | `'Orbitron'` | 900 | 22px | `--cyan-primary` with glow |
| **Logo icon ≡** | `'Orbitron'` | 700 | 18px | `--cyan-primary` |
| **Version "v1.0"** | `'Share Tech Mono'` | 400 | 12px | `--text-secondary` |
| **Topbar nav labels** | `'Share Tech Mono'` | 400 | 12px | `--text-primary` / `--cyan-primary` |
| **Panel headers** | `'Orbitron'` | 700 | 11px | `--text-primary` |
| **Bubble node labels** | `'Orbitron'` | 700 | 10px | `--cyan-primary` / `--text-primary` |
| **Task list** | `'Share Tech Mono'` | 400 | 12px | `--text-primary` (name) + `--cyan-primary` (count) |
| **Chat tags [SYS], HERMES, USER** | `'Share Tech Mono'` | 700 | 12px | amber / cyan / white |
| **Chat body** | `'Share Tech Mono'` | 400 | 12px | `--text-primary` |
| **Input placeholder** | `'Share Tech Mono'` | 400 | 13px | `--text-secondary` |
| **Status label "IDLE"** | `'Orbitron'` | 700 | 14px | `--cyan-primary` |

### Text Rules
- All panel headers and nav labels: **ALL CAPS**, `letter-spacing: 0.12em`
- Agent names in task list: **ALL CAPS**, e.g. `RECON`, `CODE`, `CTF`, `HERMES`
- Tab labels: ALL CAPS
- Chat body text: sentence case, monospace
- No italic usage anywhere in the interface
- No font below 10px

---

## 5. Component Specifications

### 5.1 Topbar

**Height:** 48px  
**Background:** `--bg-panel` with `border-bottom: 2px solid var(--border-panel)`  
**Layout:** `flex`, `align-items: center`, `padding: 0 20px`, `gap: 16px`

**Elements left → right:**

| Element | Details |
|---------|---------|
| ≡ icon | Three-line stack icon, `--cyan-primary`, 18px |
| HERMES wordmark | Orbitron 900, 22px, `--cyan-primary`, `text-shadow: 0 0 16px #00e8ff` |
| v1.0 | Share Tech Mono, 12px, `--text-secondary` |
| Separator gap | `flex: 1` spacer |
| ● ONLINE | Green dot (7px, pulsing) + "ONLINE" in green, 12px Orbitron |
| IDLE MODE | Centered, `--text-primary`, 13px, Orbitron |
| Separator gap | `flex: 1` spacer |
| AGENTS: label | `--cyan-primary`, Orbitron, 12px |
| ANALYSIS pill | Active state — cyan border + text |
| \| CTF | Separator + label |
| \| + VOICE | Separator + label |
| ▼ | Dropdown chevron, cyan |

---

### 5.2 Left Panel — Agent Panel

**Width:** ~280px  
**Background:** `--bg-panel`  
**Border:** `border-right: 1px solid var(--border-panel)`  
**Top-right corner badge:** `CTF` in a small cyan-bordered box

#### Header
```
AGENT PANEL                    [CTF]
```
- "AGENT PANEL" — Orbitron 700, 11px, `--text-primary`, ALL CAPS
- CTF badge — `border: 1px solid --cyan-primary`, `color: --cyan-primary`, 10px, padding 2px 6px

#### Orbital Bubble Map

A circular orbital diagram occupying the upper ~55% of the panel.

**Structure:**
- Central node: HERMES — filled cyan circle (~40px diameter), white Orbitron label, glow ring
- Orbit ring: dashed circle in `--cyan-dim`, `stroke-dasharray: 6 4`
- Satellite nodes: smaller cyan dots on the orbit — one labeled `CF` visible, others unlabeled
- `+` icon on the left edge of the orbit = add agent button
- Connector lines: `1px dashed --cyan-dim` from center to each satellite

**Visual rules:**
- HERMES node: `background: --cyan-primary`, `box-shadow: 0 0 20px --cyan-glow`
- Satellite nodes: `background: --cyan-primary`, smaller glow
- Orbit dashes: `border: 1px dashed --cyan-dim`, no fill

#### Task List (below bubble map)

```
■ RECON    2 TASKS
■ CODE     3 TASKS
■ CTF      IDLE
■ HERMES   1 TASKS
```

**Layout:** Each row `display: flex; justify-content: space-between; padding: 5px 12px`  
**Indicator:** Small filled square `■` — `--cyan-primary` for active, `--text-secondary` for idle  
**Agent name:** Orbitron 700, 12px, `--text-primary`  
**Task count:** Share Tech Mono, 12px, `--cyan-primary`  
**Idle label:** Share Tech Mono, 12px, `--text-secondary`

---

### 5.3 Avatar Core (Zone 4)

The emotional and visual center of the entire interface.

**Background:** Deep space — `background: radial-gradient(ellipse at 50% 40%, #0a1a30 0%, #040810 100%)` with scattered point-star SVG overlay

**Avatar Container (orbital frame):**
- Outer orbit ring: `border: 1px solid --cyan-primary`, `border-radius: 50%`, ~340px diameter, `box-shadow: 0 0 30px rgba(0,232,255,0.25)`, with two horizontal "arm" lines extending left and right from the 9 o'clock and 3 o'clock positions
- Inner avatar circle: ~270px diameter, `border-radius: 50%`, `overflow: hidden`
- Avatar image: female AI portrait, dark hair, glowing cyan eyes, tactical dark jacket — centered, fills circle
- Avatar glow: `box-shadow: inset 0 0 40px rgba(0,232,255,0.2), 0 0 60px rgba(0,232,255,0.15)`

**Horizontal arm lines:**
- Two lines extending ~60px left and right from the center ring at equator height
- `stroke: --cyan-primary`, `stroke-width: 1.5`, with a small circle cap at the tip

**Status Label (below avatar):**
```
● IDLE
```
- Dot: `--cyan-primary`, pulsing
- Text: Orbitron 700, 14px, `--cyan-primary`, `letter-spacing: 0.2em`
- Position: centered, ~20px below ring bottom edge

**Avatar States:**

| State | Ring | Dot Color | Animation |
|-------|------|-----------|-----------|
| IDLE | Dim cyan, slow pulse | Cyan | Gentle breathe 3s |
| TRANSMITTING | Bright cyan, spinning arcs | Cyan fast | Ring rotation 1s |
| PROCESSING | Amber tint ring | Amber | Rotating segments |
| ALERT | Red flash | Red | Rapid pulse 0.4s |

---

### 5.4 Right Panel — Telemetry / Data Readout

**Width:** ~280px  
**Background:** `--bg-panel`  
**Border:** `border-left: 1px solid var(--border-panel)`

**Contents:** Multiple rows of system telemetry readouts

**Each readout row:**
- Small cyan text label (e.g. system metric name)
- Thin horizontal bar below — filled to a percentage in `--cyan-primary`
- Some bars have a red accent (`--red-bar`) for critical values
- Font: Share Tech Mono, 10px, `--text-secondary` for labels

**Visual rules:**
- Bar height: 3px
- Bar background: `rgba(0,232,255,0.1)` (dark cyan track)
- Bar fill: `--cyan-primary` gradient left → bright
- Red bar: `--red-bar` only for alert-state metrics
- Rows spaced ~14px apart vertically

---

### 5.5 Command Interface (Zone 3)

**Height:** ~30% of window height  
**Background:** `--bg-panel`  
**Border-top:** `2px solid var(--border-panel)`

#### Tab Bar

```
▷ CHAT | TACTICAL | CODING | CTF | RESEARCH | AUTO
```

- Height: 36px
- Active tab `CHAT`: filled background `rgba(0,232,255,0.12)`, `border-bottom: 2px solid --cyan-primary`, `color: --cyan-primary`, leading `▷` icon
- Inactive tabs: `color: --text-secondary`, hover → `--text-primary`
- All caps, Share Tech Mono, 12px
- Tab separator: `1px solid var(--border-panel)`
- Right edge: small icon buttons (settings, etc.)

#### Message Log

**3 message rows visible (no scroll bar unless overflow):**

```
[SYS]   SYSTEM DIAGNOSTICS COMPLETE.
HERMES ▶ All systems nominal. Awaiting your command.
USER   ▶ Initiate reconnaissance scan.
```

**Row styling:**

| Type | Tag Color | Tag Style | Body Color |
|------|-----------|-----------|------------|
| `[SYS]` | `--amber-sys` `#e8a020` | brackets, bold | `--text-primary`, ALL CAPS body |
| `HERMES ▶` | `--cyan-primary` | no brackets, bold | `--text-primary`, sentence case |
| `USER ▶` | `#ffffff` | no brackets, bold | `--text-primary`, sentence case |

- Padding: `10px 16px` per row
- Row divider: none — separation by spacing only
- Background: `--bg-surface` with subtle left-border glow per message type

#### Command Input Bar

```
▶  | Enter command...                              [≈] [◄►]
```

- Height: 44px
- Background: `--bg-surface`
- Border-top: `1px solid var(--border-panel)`
- `▶` prompt: `--cyan-primary`, 16px, left-padded 14px
- Input field: flex-grow, Share Tech Mono 13px, placeholder `--text-secondary`
- Right buttons: `[≈]` settings icon + `[◄►]` navigation/submit — both in small bordered boxes, `--cyan-primary`
- On focus: `border: 1px solid --cyan-primary`, `box-shadow: 0 0 12px rgba(0,232,255,0.15)`

---

## 6. Motion & Animation

### Principles
- `ease-in-out` for all transitions
- Avatar animations run continuously; UI animations are event-triggered
- No animation should draw eye away from active task area

### Key Animations

| Element | Type | Duration | Loop |
|---------|------|----------|------|
| Online green dot | opacity pulse 1 → 0.3 → 1 | 2s | ∞ |
| Avatar ring | brightness pulse + slow glow expand | 3s | ∞ |
| Status dot (IDLE) | opacity pulse 1 → 0.5 → 1 | 2.5s | ∞ |
| Active agent bubble | scale 1 → 1.06 → 1 | 3s | ∞ |
| Tab switch | opacity + translateY(4px → 0) | 150ms | once |
| New chat message | fade in + translateY(6px → 0) | 200ms | once |
| Input focus glow | box-shadow expand | 200ms | once |
| TRANSMITTING ring | rotate 0 → 360deg | 1.2s | ∞ |
| PROCESSING ring | rotate with segment flash | 0.8s | ∞ |

---

## 7. Interaction Patterns

### Command Input
- `Enter` to submit command
- `↑` `↓` = command history navigation
- `/agent <name>` — address specific agent
- `/mode <name>` — switch operating mode
- Tab-completion for known commands and agent names
- Right `[≈]` button = open quick settings
- Right `[◄►]` button = navigate history or submit

### Agent Panel
- Click bubble node → expand agent detail (drawer or inline expand)
- Hover node → tooltip: agent name, status, active tasks
- `+` button on orbit = spawn new agent modal
- Click agent row in task list → same as clicking bubble

### Avatar
- Hover → slight brightness increase on ring
- Click → enter HERMES Focus Mode: avatar expands to full left panel, chat takes full right
- Avatar expression/animation changes with AI state (idle drift vs. active generation)

### Mode Tabs
| Tab | Mode Behavior |
|-----|--------------|
| CHAT | General assistant conversation |
| TACTICAL | Structured mission/task planning |
| CODING | Code editor context, syntax highlighting |
| CTF | Capture-the-flag / security challenge tools |
| RESEARCH | Web retrieval, source citation mode |
| AUTO | Autonomous multi-agent execution |

---

## 8. Panel Border System

Every panel uses a consistent hard-border language:

```
Outer window:     2px solid #0d2035 (--border-panel)
Panel dividers:   1px solid #0d2035
Inner components: 1px solid rgba(0,232,255,0.2) (cyan-tinted)
Active elements:  1px solid #00e8ff (full cyan)
Corner accents:   Small L-shaped corner marks in --cyan-dim
```

Corner accent pattern (used on panel corners and avatar frame):
```
╔═        ═╗
║           ║
            
║           ║
╚═        ═╝
```
- Each corner: 12px × 12px L-shape
- Color: `--cyan-dim`
- Stroke: `1.5px`

---

## 9. Responsive Behavior

HERMES is a **desktop-first** application. Minimum supported window: `1280 × 800px`.

| Breakpoint | Change |
|-----------|--------|
| < 1440px | Right telemetry panel collapses; data moves to tooltip on avatar hover |
| < 1280px | Left panel collapses to icon-only (48px wide) |
| < 1024px | Avatar zone stacks above chat; single column layout |
| < 800px | Left panel hidden; hamburger toggle |

---

## 10. Accessibility

- All interactive elements: visible focus ring `outline: 2px solid --cyan-primary; outline-offset: 2px`
- Status is never color-only — always paired with text label (ONLINE, IDLE, etc.)
- Minimum contrast: 4.5:1 for all text against dark backgrounds
- Full keyboard navigation: Tab order follows visual left-to-right, top-to-bottom
- `aria-live="polite"` on message log for screen reader announcements
- All agent bubbles: `aria-label="Agent: {name}, {n} tasks active"`
- Avatar status: `aria-live="assertive"` when state changes (IDLE → TRANSMITTING)

---

## 11. Sound Design (Optional Layer)

| Event | Sound Character |
|-------|----------------|
| App boot | Low synth swell + data-stream burst, 1.2s |
| HERMES message received | Short digital chime, 0.3s |
| System alert `[SYS]` | Amber-tone ping, 0.4s |
| Command sent | Keystroke click confirm, 0.1s |
| Tab / mode switch | Soft whoosh, 0.2s |
| Agent activated | Rising tone, 0.5s |
| Alert state | Rapid dual-ping, repeating |

All sounds: opt-in, toggled in Settings → Audio. Default: **OFF**.

---

## 12. Asset Reference

| Asset | Description | Format |
|-------|-------------|--------|
| `hermes-avatar.webp` | AI companion portrait — dark hair, cyan-lit, tactical jacket | WebP, min 512×512 |
| `hermes-logo.svg` | ≡ HERMES wordmark with glow | SVG |
| `starfield-bg.svg` | Scattered point stars for avatar zone background | SVG overlay |
| `orbital-ring.svg` | Double-ring frame with horizontal arms | SVG animated |
| `panel-corners.svg` | Reusable L-corner accent marks | SVG sprite |
| `scanlines.png` | Subtle repeating scanline overlay (3% opacity) | PNG tile |

---

*HERMES UI/UX Specification — v1.0 — Updated from Rendered Interface — Confidential*
