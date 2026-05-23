import { create } from 'zustand'
import type {
  HermesState,
  AvatarState,
  HermesMode,
  ChatMode,
  Agent,
  MemoryNode,
  AppTask,
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

export const useHermesStore = create<HermesState>((set) => ({
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
      content: 'HERMES v1.0 initialized. All systems nominal.',
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

  // UI
  activeSidebarTab: 'agents',
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  leftPanelOpen: true,
  toggleLeftPanel: () => set((s) => ({ leftPanelOpen: !s.leftPanelOpen })),
}))
