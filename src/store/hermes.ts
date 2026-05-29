// @ts-nocheck
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  HermesState,
  AvatarState,
  HermesMode,
  ChatMode,
  Agent,
  MemoryNode,
  AppTask,
  UserSettings,
} from './types'

const DEMO_AGENTS: Agent[] = [
  { id: 'recon', name: 'Recon', role: 'Search & Discovery', status: 'active', tasksActive: 2, tasksCompleted: 14, connections: ['code', 'hermes'] },
  { id: 'code', name: 'Code', role: 'Build & Debug', status: 'working', tasksActive: 3, tasksCompleted: 27, connections: ['recon', 'hermes'] },
  { id: 'ctf', name: 'CTF', role: 'Security Ops', status: 'idle', tasksActive: 0, tasksCompleted: 8, connections: ['hermes'] },
  { id: 'hermes', name: 'Hermes', role: 'Orchestrator', status: 'active', tasksActive: 1, tasksCompleted: 42, connections: ['recon', 'code', 'ctf'] },
]

const DEMO_MEMORY: MemoryNode[] = [
  { id: 'm1', category: 'preference', label: 'User Prefs', connections: ['m2', 'm5'] },
  { id: 'm2', category: 'mission', label: 'Active Missions', connections: ['m1', 'm3'] },
  { id: 'm3', category: 'file', label: 'Recent Files', connections: ['m2', 'm4'] },
  { id: 'm4', category: 'context', label: 'Session Context', connections: ['m3', 'm5'] },
  { id: 'm5', category: 'skill', label: 'Loaded Skills', connections: ['m4', 'm1'] },
  { id: 'm6', category: 'longterm', label: 'Long-Term', connections: ['m1', 'm4'] },
]

const DEMO_TASKS: AppTask[] = [
  { id: 't1', title: 'Initialize avatar system', agentId: 'code', status: 'completed', progress: 100 },
  { id: 't2', title: 'Scan network for open ports', agentId: 'recon', status: 'in_progress', progress: 67 },
  { id: 't3', title: 'Deploy particle engine', agentId: 'code', status: 'in_progress', progress: 34 },
  { id: 't4', title: 'Wait for CTF targets', agentId: 'ctf', status: 'pending', progress: 0 },
]

const DEFAULT_SETTINGS: UserSettings = {
  active_provider: 'ollama',
  models: [
    {
      id: 'ollama-default',
      name: 'Ollama (Local)',
      provider: 'ollama',
      base_url: 'http://localhost:11434',
      model_name: 'llama3.2',
      api_key: '',
      context_length: 128000,
      is_active: true,
    },
  ],
  ollama_modules: [
    { id: 'qwen-coding', name: 'Qwen 2.5 Coder', description: 'Coding & code review specialist', category: 'coding', model_name: 'qwen2.5-coder:7b', size_gb: 4.7, installed: false, recommended: true },
    { id: 'llama-vision', name: 'Llama 3.2 Vision', description: 'Image reading & visual understanding', category: 'vision', model_name: 'llama3.2-vision:11b', size_gb: 7.8, installed: false, recommended: true },
    { id: 'stable-diffusion', name: 'Stable Diffusion', description: 'Image generation from text prompts', category: 'image', model_name: 'stabilityai/stable-diffusion-xl-base-1.0', size_gb: 6.5, installed: false, recommended: false },
    { id: 'llama-chat', name: 'Llama 3.2 Chat', description: 'General purpose conversation', category: 'chat', model_name: 'llama3.2:3b', size_gb: 2.0, installed: false, recommended: true },
    { id: 'deepseek-r1', name: 'DeepSeek R1', description: 'Advanced reasoning & problem solving', category: 'reasoning', model_name: 'deepseek-r1:7b', size_gb: 4.7, installed: false, recommended: true },
    { id: 'nomic-embed', name: 'Nomic Embed', description: 'Text embeddings for search & memory', category: 'embedding', model_name: 'nomic-embed-text', size_gb: 0.27, installed: false, recommended: true },
    { id: 'whisper', name: 'Whisper', description: 'Speech-to-text transcription', category: 'audio', model_name: 'whisper', size_gb: 1.5, installed: false, recommended: false },
    { id: 'codellama', name: 'Code Llama', description: 'Alternative coding model', category: 'coding', model_name: 'codellama:13b', size_gb: 7.4, installed: false, recommended: false },
    { id: 'bakllava', name: 'BakLLaVA', description: 'Multi-modal vision + language', category: 'vision', model_name: 'bakllava', size_gb: 4.7, installed: false, recommended: false },
    { id: 'mixtral', name: 'Mixtral 8x7B', description: 'Mixture-of-experts general model', category: 'chat', model_name: 'mixtral:8x7b', size_gb: 26.0, installed: false, recommended: false },
  ],
  hermes_docker: {
    docker_url: 'http://localhost:11434',
    api_key: '',
    port: 11434,
    connected: false,
  },
  audio_enabled: false,
  animations_enabled: true,
  theme: 'cyber',
}

export const useHermesStore = create<HermesState>()(
  persist(
    (set) => ({
  // Avatar
  avatarState: 'idle',
  setAvatarState: (state: AvatarState) => set({ avatarState: state }),

  // Mode
  mode: 'idle',
  chatMode: 'chat',
  setMode: (mode: HermesMode) => set({ mode }),
  setChatMode: (chatMode: ChatMode) => set({ chatMode }),

  // Chat
  messages: [
    {
      id: 'sys-1',
      role: 'system',
      content: 'HERMES v2.0 online. Awaiting command.',
      timestamp: Date.now() - 60000,
      mode: 'chat',
    },
    {
      id: 'hermes-1',
      role: 'hermes',
      content: 'Welcome, Operator. I am Hermes — your cybernetic intelligence companion. All subsystems are online. The avatar core is loaded, agents are standing by, and the neural network is mapped. How may I assist you today?',
      timestamp: Date.now() - 30000,
      mode: 'chat',
    },
  ],
  isStreaming: false,
  streamingText: '',
  addMessage: (msg) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { ...msg, id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, timestamp: Date.now() },
      ],
    })),
  appendStream: (chunk) => set((s) => ({ streamingText: s.streamingText + chunk })),
  finishStream: () =>
    set((s) => {
      if (!s.streamingText) return {}
      return {
        messages: [
          ...s.messages,
          {
            id: `stream-${Date.now()}`,
            role: 'hermes' as const,
            content: s.streamingText,
            timestamp: Date.now(),
            mode: s.chatMode,
          },
        ],
        streamingText: '',
        isStreaming: false,
      }
    }),
  clearChat: () => set({ messages: [], streamingText: '', isStreaming: false }),

  // Agents
  agents: DEMO_AGENTS,
  updateAgent: (id, updates) =>
    set((s) => ({
      agents: s.agents.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
  addAgent: (agent) => set((s) => ({ agents: [...s.agents, agent] })),

  // Memory
  memoryNodes: DEMO_MEMORY,
  addMemoryNode: (node) => set((s) => ({ memoryNodes: [...s.memoryNodes, node] })),

  // Tasks
  tasks: DEMO_TASKS,
  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  // Connection
  isConnected: true,
  setConnected: (v) => set({ isConnected: v }),

  // Settings
  settings: DEFAULT_SETTINGS,
  updateSettings: (updates) =>
    set((s) => ({ settings: { ...s.settings, ...updates } })),
  addModel: (model) =>
    set((s) => ({ settings: { ...s.settings, models: [...s.settings.models, model] } })),
  removeModel: (id) =>
    set((s) => ({
      settings: { ...s.settings, models: s.settings.models.filter((m) => m.id !== id) },
    })),
  setActiveModel: (id) =>
    set((s) => ({
      settings: {
        ...s.settings,
        models: s.settings.models.map((m) => ({ ...m, is_active: m.id === id })),
      },
    })),
  updateOllamaModule: (id, installed) =>
    set((s) => ({
      settings: {
        ...s.settings,
        ollama_modules: s.settings.ollama_modules.map((m) =>
          m.id === id ? { ...m, installed } : m
        ),
      },
    })),

  // UI
  activeSidebarTab: 'agents',
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  leftPanelOpen: true,
  toggleLeftPanel: () => set((s) => ({ leftPanelOpen: !s.leftPanelOpen })),
    }),
    {
      name: 'hermes-storage',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
)
