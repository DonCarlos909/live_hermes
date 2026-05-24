// ============================================
// Zustand Store Types
// ============================================

export type AvatarState = 'idle' | 'speaking' | 'thinking' | 'listening'
export type HermesMode = 'idle' | 'analysis' | 'ctf' | 'coding' | 'voice'
export type ChatMode = 'chat' | 'tactical' | 'coding' | 'ctf' | 'research' | 'autonomous'
export type AgentStatus = 'active' | 'idle' | 'working' | 'error'

export interface Agent {
  id: string
  name: string
  role: string
  status: AgentStatus
  tasksActive: number
  tasksCompleted: number
  connections: string[]  // IDs of connected agents
}

export interface ChatMessage {
  id: string
  role: 'user' | 'hermes' | 'system'
  content: string
  timestamp: number
  mode: ChatMode
}

export interface MemoryNode {
  id: string
  category: 'preference' | 'mission' | 'file' | 'context' | 'skill' | 'longterm'
  label: string
  connections: string[]
}

export interface AppTask {
  id: string
  title: string
  agentId: string | null
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  progress: number
}

// ============================================
// LLM / Settings Types
// ============================================

export type LLMProvider = 'ollama' | 'lmstudio' | 'llamacpp' | 'vllm' | 'openrouter' | 'custom'

export interface LLMModel {
  id: string
  name: string
  provider: LLMProvider
  base_url: string
  model_name: string
  api_key: string
  context_length: number
  is_active: boolean
}

export interface OllamaModule {
  id: string
  name: string
  description: string
  category: 'coding' | 'vision' | 'image' | 'chat' | 'reasoning' | 'embedding' | 'audio'
  model_name: string
  size_gb: number
  installed: boolean
  recommended: boolean
}

export interface HermesConnectionConfig {
  docker_url: string
  api_key: string
  port: number
  connected: boolean
}

export interface UserSettings {
  // LLM
  active_provider: LLMProvider
  models: LLMModel[]
  ollama_modules: OllamaModule[]
  hermes_docker: HermesConnectionConfig
  // UI
  audio_enabled: boolean
  animations_enabled: boolean
  theme: 'cyber' | 'dark' | 'matrix'
}

export interface HermesState {
  // Avatar
  avatarState: AvatarState
  setAvatarState: (state: AvatarState) => void

  // Mode
  mode: HermesMode
  chatMode: ChatMode
  setMode: (mode: HermesMode) => void
  setChatMode: (chatMode: ChatMode) => void

  // Chat
  messages: ChatMessage[]
  isStreaming: boolean
  streamingText: string
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  appendStream: (chunk: string) => void
  finishStream: () => void
  clearChat: () => void

  // Agents
  agents: Agent[]
  updateAgent: (id: string, updates: Partial<Agent>) => void
  addAgent: (agent: Agent) => void

  // Memory
  memoryNodes: MemoryNode[]
  addMemoryNode: (node: MemoryNode) => void

  // Tasks
  tasks: AppTask[]
  addTask: (task: AppTask) => void
  updateTask: (id: string, updates: Partial<AppTask>) => void

  // Connection
  isConnected: boolean
  setConnected: (v: boolean) => void

  // Settings
  settings: UserSettings
  updateSettings: (updates: Partial<UserSettings>) => void
  addModel: (model: LLMModel) => void
  removeModel: (id: string) => void
  setActiveModel: (id: string) => void
  updateOllamaModule: (id: string, installed: boolean) => void

  // UI
  activeSidebarTab: string
  setActiveSidebarTab: (tab: string) => void
  leftPanelOpen: boolean
  toggleLeftPanel: () => void
}
