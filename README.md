# HERMES — Live Cybernetic Intelligence

A desktop AI companion with a cyberpunk interface. Connects to any local or cloud LLM.

## Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org)
- [Rust + Cargo](https://rustup.rs)
- An LLM backend (pick one):
  - **[Ollama](https://ollama.com)** (easiest — local, free)
  - **[LM Studio](https://lmstudio.ai)** (local, GUI-based)
  - **[OpenRouter](https://openrouter.ai)** (cloud, needs API key)

### Install & Run

```bash
git clone https://github.com/DonCarlos909/live_hermes.git
cd live_hermes
npm install
npm run tauri dev
```

### First-Time Setup

1. Open the app
2. Click **AGENTS** → **CONFIG** tab in the left panel (or click the ⚙ icon in chat)
3. Under **LLM Config**, click **+ Add Model**
4. Fill in your provider details:

| Provider    | Base URL                       | API Key     |
|-------------|-------------------------------|-------------|
| Ollama      | `http://localhost:11434`       | (none)      |
| LM Studio   | `http://localhost:1234/v1`     | (none)      |
| OpenRouter  | `https://openrouter.ai/api/v1` | Required    |
| vLLM        | `http://localhost:8000/v1`     | (none)      |

5. Set **Model Name** (e.g. `llama3.2`, `mistral`, `deepseek-r1:7b`)
6. Click **Set Active** on your model
7. Type in the chat — HERMES will respond for real!

### Ollama Quick Setup (Windows)

```powershell
# Install Ollama
winget install Ollama.Ollama
# Pull a model
ollama pull llama3.2
# Start Ollama (runs in background)
ollama serve
```

Then set base URL to `http://localhost:11434` and model name to `llama3.2`.

---

## Chat Modes

| Mode     | Purpose                                      |
|----------|----------------------------------------------|
| CHAT     | General conversation                         |
| TACTICAL | Mission planning, strategic analysis         |
| CODING   | Programming, debugging, code review          |
| CTF      | Cybersecurity, exploit analysis, CTF help    |
| RESEARCH | Deep research, multi-perspective analysis    |
| AUTO     | Step-by-step autonomous task execution       |

## Build Installer

```bash
npm run tauri build
```

Output: `src-tauri/target/release/bundle/` (`.msi` or `.exe` installer)

---

## Stack

- **Frontend**: React + TypeScript + Vite
- **Desktop**: Tauri 2 (Rust)
- **State**: Zustand (persisted to localStorage)
- **Animations**: Framer Motion + Canvas API
- **LLM**: Any OpenAI-compatible API or Ollama
