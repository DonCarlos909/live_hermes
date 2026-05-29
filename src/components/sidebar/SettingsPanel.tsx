// @ts-nocheck
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, Cpu, Wifi, WifiOff, Check, Download, Trash2,
  Server, Brain, Eye, Image, Mic, Code, BookOpen, ChevronRight,
  Loader, AlertCircle
} from 'lucide-react'
import { useHermesStore } from '../../store/hermes'
import type { LLMProvider, LLMModel, OllamaModule } from '../../store/types'

// ============================================
// Sub-tab definitions
// ============================================
type SettingsTab = 'llm' | 'ollama' | 'hermes' | 'guide'

const SUB_TABS: { id: SettingsTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'llm', label: 'LLM Config', icon: Brain },
  { id: 'ollama', label: 'Ollama', icon: Cpu },
  { id: 'hermes', label: 'Hermes', icon: Server },
  { id: 'guide', label: 'User Guide', icon: BookOpen },
]

// ============================================
// Provider presets
// ============================================
const PROVIDER_PRESETS: Record<LLMProvider, { base_url: string; needsKey: boolean }> = {
  ollama: { base_url: 'http://localhost:11434', needsKey: false },
  lmstudio: { base_url: 'http://localhost:1234/v1', needsKey: false },
  llamacpp: { base_url: 'http://localhost:8080/v1', needsKey: false },
  vllm: { base_url: 'http://localhost:8000/v1', needsKey: false },
  openrouter: { base_url: 'https://openrouter.ai/api/v1', needsKey: true },
  custom: { base_url: '', needsKey: true },
}

// ============================================
// Category icons for Ollama modules
// ============================================
const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  coding: Code,
  vision: Eye,
  image: Image,
  chat: Brain,
  reasoning: Brain,
  embedding: Brain,
  audio: Mic,
}

// ============================================
// Status indicator component
// ============================================
function StatusDot({ connected, label }: { connected: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: connected ? '#22d3ee' : '#ff2d55',
          boxShadow: connected ? '0 0 8px #22d3ee' : '0 0 8px #ff2d55',
          animation: 'pulse 2s infinite',
        }}
      />
      <span className="text-[9px] font-mono" style={{ color: connected ? '#22d3ee' : '#ff2d55' }}>
        {label}
      </span>
    </div>
  )
}

// ============================================
// LLM Config Panel
// ============================================
function LLMConfigPanel() {
  const settings = useHermesStore((s) => s.settings)
  const updateSettings = useHermesStore((s) => s.updateSettings)
  const addModel = useHermesStore((s) => s.addModel)
  const removeModel = useHermesStore((s) => s.removeModel)
  const setActiveModel = useHermesStore((s) => s.setActiveModel)
  const [testing, setTesting] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})

  const testConnection = async (model: LLMModel) => {
    setTesting(model.id)
    try {
      if (model.provider === 'ollama') {
        const res = await fetch(`${model.base_url}/api/tags`, { signal: AbortSignal.timeout(3000) })
        const ok = res.ok
        setTestResults((p) => ({ ...p, [model.id]: ok }))
      } else {
        // Generic OpenAI-compatible test
        const res = await fetch(`${model.base_url}/models`, {
          headers: model.api_key ? { Authorization: `Bearer ${model.api_key}` } : {},
          signal: AbortSignal.timeout(5000),
        })
        setTestResults((p) => ({ ...p, [model.id]: res.ok }))
      }
    } catch {
      setTestResults((p) => ({ ...p, [model.id]: false }))
    }
    setTesting(null)
  }

  const addNewModel = () => {
    const id = `model-${Date.now()}`
    addModel({
      id,
      name: 'New Model',
      provider: 'ollama',
      base_url: 'http://localhost:11434',
      model_name: '',
      api_key: '',
      context_length: 128000,
      is_active: false,
    })
  }

  return (
    <div className="flex flex-col gap-3 p-3 h-full overflow-y-auto scrollbar-thin">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-mono tracking-wider text-white/50">CONFIGURED MODELS</h3>
        <button
          onClick={addNewModel}
          className="text-[9px] font-mono px-2 py-1 rounded border border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-colors"
        >
          + ADD MODEL
        </button>
      </div>

      {settings.models.map((model) => (
        <motion.div
          key={model.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border p-3"
          style={{
            borderColor: model.is_active ? '#00d4ff44' : '#ffffff11',
            background: model.is_active ? '#00d4ff08' : 'transparent',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {model.is_active && (
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 6px #22d3ee' }} />
              )}
              <input
                type="text"
                value={model.name}
                onChange={(e) => {
                  const updated = settings.models.map((m) =>
                    m.id === model.id ? { ...m, name: e.target.value } : m
                  )
                  updateSettings({ models: updated })
                }}
                className="bg-transparent text-[11px] font-mono text-[#f0f0ff] outline-none border-b border-transparent focus:border-[#00d4ff33] w-32"
              />
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => testConnection(model)}
                disabled={testing === model.id}
                className="text-[8px] font-mono px-2 py-0.5 rounded border border-white/10 text-white/40 hover:text-[#00d4ff] hover:border-[#00d4ff33] transition-colors flex items-center gap-1"
              >
                {testing === model.id ? (
                  <Loader size={8} className="animate-spin" />
                ) : testResults[model.id] !== undefined ? (
                  testResults[model.id] ? <Check size={8} className="text-green-400" /> : <AlertCircle size={8} className="text-red-400" />
                ) : null}
                TEST
              </button>
              <button
                onClick={() => setActiveModel(model.id)}
                className="text-[8px] font-mono px-2 py-0.5 rounded border transition-colors"
                style={{
                  borderColor: model.is_active ? '#00d4ff' : '#ffffff11',
                  color: model.is_active ? '#00d4ff' : '#ffffff44',
                  background: model.is_active ? '#00d4ff18' : 'transparent',
                }}
              >
                {model.is_active ? 'ACTIVE' : 'SET ACTIVE'}
              </button>
              <button
                onClick={() => removeModel(model.id)}
                className="text-white/20 hover:text-[#ff2d55] transition-colors p-0.5"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] font-mono text-white/30 block mb-0.5">Provider</label>
              <select
                value={model.provider}
                onChange={(e) => {
                  const provider = e.target.value as LLMProvider
                  const preset = PROVIDER_PRESETS[provider]
                  const updated = settings.models.map((m) =>
                    m.id === model.id
                      ? { ...m, provider, base_url: preset.base_url }
                      : m
                  )
                  updateSettings({ models: updated })
                }}
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-[#f0f0ff] outline-none focus:border-[#00d4ff33]"
              >
                {Object.keys(PROVIDER_PRESETS).map((p) => (
                  <option key={p} value={p} className="bg-[#0a0a0f]">
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[8px] font-mono text-white/30 block mb-0.5">Model Name</label>
              <input
                type="text"
                value={model.model_name}
                onChange={(e) => {
                  const updated = settings.models.map((m) =>
                    m.id === model.id ? { ...m, model_name: e.target.value } : m
                  )
                  updateSettings({ models: updated })
                }}
                placeholder="e.g. llama3.2"
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-[#f0f0ff] outline-none focus:border-[#00d4ff33] placeholder:text-white/15"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[8px] font-mono text-white/30 block mb-0.5">Base URL</label>
              <input
                type="text"
                value={model.base_url}
                onChange={(e) => {
                  const updated = settings.models.map((m) =>
                    m.id === model.id ? { ...m, base_url: e.target.value } : m
                  )
                  updateSettings({ models: updated })
                }}
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-[#f0f0ff] outline-none focus:border-[#00d4ff33] placeholder:text-white/15"
              />
            </div>
            {PROVIDER_PRESETS[model.provider].needsKey && (
              <div className="col-span-2">
                <label className="text-[8px] font-mono text-white/30 block mb-0.5">API Key</label>
                <input
                  type="password"
                  value={model.api_key}
                  onChange={(e) => {
                    const updated = settings.models.map((m) =>
                      m.id === model.id ? { ...m, api_key: e.target.value } : m
                    )
                    updateSettings({ models: updated })
                  }}
                  placeholder="sk-..."
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-[#f0f0ff] outline-none focus:border-[#00d4ff33] placeholder:text-white/15"
                />
              </div>
            )}
            <div>
              <label className="text-[8px] font-mono text-white/30 block mb-0.5">Context Length</label>
              <input
                type="number"
                value={model.context_length}
                onChange={(e) => {
                  const updated = settings.models.map((m) =>
                    m.id === model.id ? { ...m, context_length: parseInt(e.target.value) || 0 } : m
                  )
                  updateSettings({ models: updated })
                }}
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-[#f0f0ff] outline-none focus:border-[#00d4ff33]"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ============================================
// Ollama Modules Panel
// ============================================
function OllamaModulesPanel() {
  const settings = useHermesStore((s) => s.settings)
  const updateOllamaModule = useHermesStore((s) => s.updateOllamaModule)
  const [installing, setInstalling] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const categories = ['all', 'coding', 'vision', 'image', 'chat', 'reasoning', 'embedding', 'audio']
  const filtered = filter === 'all'
    ? settings.ollama_modules
    : settings.ollama_modules.filter((m) => m.category === filter)

  const totalSize = filtered.filter((m) => m.installed).reduce((s, m) => s + m.size_gb, 0)
  const recommendedCount = settings.ollama_modules.filter((m) => m.recommended).length

  const handleInstall = async (mod: OllamaModule) => {
    setInstalling(mod.id)
    // Simulate pull — in real app this would call Tauri command to run `ollama pull`
    await new Promise((r) => setTimeout(r, 1500))
    updateOllamaModule(mod.id, true)
    setInstalling(null)
  }

  const handleUninstall = async (mod: OllamaModule) => {
    updateOllamaModule(mod.id, false)
  }

  return (
    <div className="flex flex-col gap-3 p-3 h-full overflow-y-auto scrollbar-thin">
      {/* Stats bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-white/30">
            {filtered.filter((m) => m.installed).length}/{filtered.length} INSTALLED
          </span>
          <span className="text-[9px] font-mono text-white/30">
            {totalSize.toFixed(1)} GB USED
          </span>
          {filter === 'all' && (
            <span className="text-[9px] font-mono text-[#00d4ff]">
              {recommendedCount} RECOMMENDED
            </span>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-1 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="text-[8px] font-mono px-2 py-0.5 rounded-full border transition-colors"
            style={{
              borderColor: filter === cat ? '#00d4ff' : '#ffffff11',
              color: filter === cat ? '#00d4ff' : '#ffffff44',
              background: filter === cat ? '#00d4ff15' : 'transparent',
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Module list */}
      <div className="flex flex-col gap-1.5">
        {filtered.map((mod) => {
          const CatIcon = CATEGORY_ICONS[mod.category] || Brain
          const isInstalling = installing === mod.id
          return (
            <motion.div
              key={mod.id}
              layout
              className="flex items-center gap-2 rounded-lg px-3 py-2 border transition-colors"
              style={{
                borderColor: mod.installed ? '#22d3ee33' : '#ffffff08',
                background: mod.installed ? '#22d3ee08' : 'transparent',
              }}
            >
              <CatIcon size={14} className={mod.installed ? 'text-[#22d3ee]' : 'text-white/20'} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#f0f0ff]">{mod.name}</span>
                  {mod.recommended && (
                    <span className="text-[7px] font-mono px-1 py-0 rounded bg-[#00d4ff22] text-[#00d4ff]">REC</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono text-white/30">{mod.model_name}</span>
                  <span className="text-[8px] font-mono text-white/20">{mod.size_gb} GB</span>
                </div>
              </div>
              {mod.installed ? (
                <button
                  onClick={() => handleUninstall(mod)}
                  className="text-[8px] font-mono px-2 py-1 rounded border border-[#ff2d5533] text-[#ff2d55] hover:bg-[#ff2d5511] transition-colors"
                >
                  REMOVE
                </button>
              ) : (
                <button
                  onClick={() => handleInstall(mod)}
                  disabled={isInstalling}
                  className="text-[8px] font-mono px-2 py-1 rounded border border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-colors flex items-center gap-1"
                >
                  {isInstalling ? <Loader size={8} className="animate-spin" /> : <Download size={8} />}
                  {isInstalling ? 'PULLING' : 'INSTALL'}
                </button>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// Hermes Agent Connection Panel
// ============================================
function HermesConnectionPanel() {
  const settings       = useHermesStore((s) => s.settings)
  const updateSettings = useHermesStore((s) => s.updateSettings)
  const [testing, setTesting] = useState(false)
  const [localKey, setLocalKey] = useState(settings.hermes_docker.api_key)
  const [localUrl, setLocalUrl] = useState(settings.hermes_docker.docker_url)
  const hermes = settings.hermes_docker

  // Keep local state in sync
  useEffect(() => { setLocalKey(hermes.api_key) }, [hermes.api_key])
  useEffect(() => { setLocalUrl(hermes.docker_url) }, [hermes.docker_url])

  const testHermes = async () => {
    setTesting(true)
    try {
      const headers: Record<string, string> = {}
      if (localKey) headers['Authorization'] = `Bearer ${localKey}`
      const res = await fetch(`${localUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'ping' }] }),
        signal: AbortSignal.timeout(8000),
      })
      updateSettings({ hermes_docker: { ...hermes, docker_url: localUrl, api_key: localKey, connected: res.ok } })
      useHermesStore.getState().setConnected(res.ok)
    } catch {
      updateSettings({ hermes_docker: { ...hermes, docker_url: localUrl, api_key: localKey, connected: false } })
      useHermesStore.getState().setConnected(false)
    }
    setTesting(false)
  }

  const generateKey = () => {
    const k = 'hmk_' + Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0')).join('')
    setLocalKey(k)
  }

  const isConnected = hermes.connected

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 12, height: '100%', overflowY: 'auto' }}>
      <h3 style={{ fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-0)', letterSpacing: '0.12em' }}>
        HERMES AGENT CONNECTION
      </h3>
      <p style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', lineHeight: 1.5 }}>
        Connect to Hermes Agent for real AI responses.
      </p>

      {/* Status card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${isConnected ? 'var(--green)' + '44' : 'var(--border-panel)'}`,
        background: isConnected ? 'rgba(0,232,118,0.04)' : 'var(--bg-surface)',
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: isConnected ? 'var(--green)' : 'var(--red)',
          boxShadow: isConnected ? '0 0 8px var(--green-glow)' : '0 0 8px var(--red-glow)',
          animation: 'pulse-dot 2s infinite',
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-0)', fontWeight: 600 }}>
            {isConnected ? 'Connected to Hermes Agent' : 'Not Connected'}
          </div>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>{localUrl}</div>
        </div>
        <span style={{
          fontSize: 9, fontFamily: 'var(--font-display)', fontWeight: 700,
          color: isConnected ? 'var(--green)' : 'var(--red)',
        }}>
          {isConnected ? 'LIVE' : 'OFFLINE'}
        </span>
      </div>

      {/* API Key */}
      <div>
        <label style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', display: 'block', marginBottom: 4 }}>
          API KEY (from Hermes Agent)
        </label>
        <div style={{ display: 'flex', gap: 4 }}>
          <input
            type="text"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            placeholder="Paste your Hermes API key here..."
            style={{
              flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-panel)',
              borderRadius: 'var(--radius-sm)', padding: '6px 10px',
              fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-0)', outline: 'none',
            }}
          />
          <button onClick={generateKey} title="Generate new key" style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border-panel)',
            borderRadius: 'var(--radius-sm)', padding: '4px 8px',
            color: 'var(--cyan)', fontSize: 9, fontFamily: 'var(--font-mono)',
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            GENERATE
          </button>
        </div>
        <p style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', marginTop: 4 }}>
          Generate a key and give it to Hermes Agent to authorize this app.
        </p>
      </div>

      {/* Agent URL */}
      <div>
        <label style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', display: 'block', marginBottom: 4 }}>
          AGENT URL
        </label>
        <input
          type="text"
          value={localUrl}
          onChange={(e) => setLocalUrl(e.target.value)}
          placeholder="https://your-hermes-agent.com/api"
          style={{
            width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-panel)',
            borderRadius: 'var(--radius-sm)', padding: '6px 10px',
            fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-0)', outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Test button */}
      <button
        onClick={testHermes}
        disabled={testing}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '8px', borderRadius: 'var(--radius-sm)',
          border: `1px solid ${'var(--cyan)'}33`,
          background: testing ? 'transparent' : 'var(--cyan-glow)',
          color: 'var(--cyan)', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700,
          cursor: 'pointer', transition: 'background 0.2s',
        }}
      >
        {testing ? <><span className="cursor-blink">TESTING...</span></> : 'TEST CONNECTION'}
      </button>

      {/* How it works */}
      <div style={{
        padding: 10, borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-panel)', background: 'var(--bg-surface)',
      }}>
        <h4 style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-1)', marginBottom: 6 }}>HOW IT WORKS</h4>
        <ol style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', paddingLeft: 14, lineHeight: 1.7 }}>
          <li>Click <span style={{ color: 'var(--cyan)' }}>GENERATE</span> to create an API key</li>
          <li>Give this key to Hermes Agent (via Discord or setup)</li>
          <li>Hermes Agent registers this app as authorized</li>
          <li>Click <span style={{ color: 'var(--cyan)' }}>TEST CONNECTION</span> to verify</li>
          <li>Chat now uses real Hermes AI responses</li>
        </ol>
      </div>
    </div>
  )
}

// ============================================
// User Guide Panel
// ============================================
function UserGuidePanel() {
  const guideSections = [
    {
      title: 'GETTING STARTED',
      content: [
        'HERMES is your cybernetic AI companion running as a desktop app.',
        'The sidebar on the left provides access to Agents, Memory, Tools, Tasks, Files, and Settings.',
        'Use the chat bar at the bottom to send commands or have conversations.',
        'Switch between CHAT, TACTICAL, CODING, CTF, RESEARCH, and AUTO modes using the tab bar.',
      ],
    },
    {
      title: 'CHAT MODES',
      items: [
        { mode: 'CHAT', color: '#00d4ff', desc: 'General conversation with Hermes' },
        { mode: 'TACTICAL', color: '#8b5cf6', desc: 'Mission planning and task coordination' },
        { mode: 'CODING', color: '#22d3ee', desc: 'Code generation, review, and debugging' },
        { mode: 'CTF', color: '#ff2d55', desc: 'Security challenges and capture-the-flag' },
        { mode: 'RESEARCH', color: '#f0f0ff', desc: 'Deep web research and source synthesis' },
        { mode: 'AUTO', color: '#fbbf24', desc: 'Autonomous multi-agent execution' },
      ],
    },
    {
      title: 'CONNECTING LOCAL LLM (OLLAMA)',
      content: [
        'Go to Settings → Ollama tab to browse available AI models.',
        'Click INSTALL next to any model to download it via Ollama.',
        'Recommended models: Qwen 2.5 Coder (coding), Llama 3.2 Vision (images), DeepSeek R1 (reasoning).',
        'Go to Settings → LLM Config to set your active model.',
        'Test the connection to ensure your local LLM is responding.',
      ],
    },
    {
      title: 'CONNECTING HERMES DOCKER',
      content: [
        'Hermes Agent runs in a Docker container with its own LLM.',
        'Go to Settings → Hermes tab to configure the Docker connection.',
        'Enter the Docker URL (default: http://localhost:11434).',
        'Click TEST CONNECTION to verify Hermes is reachable.',
        'Once connected, all chat responses come from Hermes AI.',
      ],
    },
    {
      title: 'AGENTS',
      content: [
        'Agents are AI specialists that handle different tasks.',
        'The central HERMES agent orchestrates all other agents.',
        'Each agent shows its status (active, working, idle) and task count.',
        'Click on an agent in the network graph to see details.',
      ],
    },
    {
      title: 'MEMORY & TOOLS',
      content: [
        'Memory Panel: Shows the neural network of stored memories and preferences.',
        'Tools Panel: Displays available tool activations for agents.',
        'Tasks Panel: Live task tracking with progress bars for each agent.',
        'Files Panel: Drag and drop files for Hermes to process.',
      ],
    },
    {
      title: 'KEYBOARD SHORTCUTS',
      items: [
        { mode: 'Enter', color: '#00d4ff', desc: 'Send message' },
        { mode: 'Esc', color: '#ff2d55', desc: 'Cancel streaming' },
        { mode: 'Tab', color: '#22d3ee', desc: 'Cycle chat modes' },
        { mode: '↑ / ↓', color: '#f0f0ff', desc: 'Command history' },
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-3 p-3 h-full overflow-y-auto scrollbar-thin">
      <h3 className="text-[10px] font-mono tracking-wider text-white/50">HERMES USER GUIDE</h3>
      {guideSections.map((section, i) => (
        <div key={i} className="rounded-lg border border-white/5 p-3 bg-white/[0.02]">
          <h4 className="text-[9px] font-mono text-[#00d4ff] tracking-wider mb-2 flex items-center gap-1">
            <ChevronRight size={10} />
            {section.title}
          </h4>
          {section.content && (
            <ul className="space-y-1">
              {section.content.map((line, j) => (
                <li key={j} className="text-[9px] font-mono text-white/40 flex gap-2">
                  <span className="text-white/15 shrink-0">▸</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          )}
          {section.items && (
            <div className="space-y-1">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-center gap-2 text-[9px] font-mono">
                  <span className="w-20 shrink-0 px-1.5 py-0.5 rounded text-center" style={{ color: item.color, background: `${item.color}15`, border: `1px solid ${item.color}33` }}>
                    {item.mode}
                  </span>
                  <span className="text-white/40">{item.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================
// Main Settings Panel
// ============================================
export default function SettingsPanel() {
  const [activeSubTab, setActiveSubTab] = useState<SettingsTab>('llm')

  return (
    <div className="flex flex-col h-full">
      {/* Settings header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 shrink-0">
        <Settings size={14} className="text-[#00d4ff]" />
        <h3 className="text-xs font-mono tracking-wider text-[#f0f0ff]">SETTINGS</h3>
        <div className="flex-1" />
        <StatusDot
          connected={useHermesStore((s) => s.settings.hermes_docker.connected)}
          label={useHermesStore((s) => s.settings.hermes_docker.connected) ? 'HERMES LIVE' : 'LOCAL ONLY'}
        />
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-white/5 shrink-0">
        {SUB_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeSubTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors relative"
              style={{ color: isActive ? '#00d4ff' : '#333' }}
            >
              <Icon size={12} />
              <span className="text-[7px] font-mono tracking-wider">{tab.label.toUpperCase()}</span>
              {isActive && (
                <motion.div
                  layoutId="settings-sub-tab"
                  className="absolute bottom-0 left-1 right-1 h-0.5 bg-[#00d4ff] rounded-full"
                  style={{ boxShadow: '0 0 6px #00d4ff' }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Sub-panel content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          className="flex-1 overflow-hidden"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 5 }}
          transition={{ duration: 0.12 }}
        >
          {activeSubTab === 'llm' && <LLMConfigPanel />}
          {activeSubTab === 'ollama' && <OllamaModulesPanel />}
          {activeSubTab === 'hermes' && <HermesConnectionPanel />}
          {activeSubTab === 'guide' && <UserGuidePanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
