// ============================================
// FirstRunSetup — Initial configuration wizard
// Shown on first launch or when settings are empty
// ============================================

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Server, ChevronRight, ChevronLeft, Check, Loader, Download } from 'lucide-react'

interface FirstRunSetupProps {
  onComplete: () => void
}

type SetupStep = 'welcome' | 'ollama' | 'hermes' | 'modules' | 'done'

export default function FirstRunSetup({ onComplete }: FirstRunSetupProps) {
  const [step, setStep] = useState<SetupStep>('welcome')
  const [ollamaInstalled, setOllamaInstalled] = useState<boolean | null>(null)
  const [dockerInstalled, setDockerInstalled] = useState<boolean | null>(null)

  const steps: { id: SetupStep; label: string }[] = [
    { id: 'welcome', label: 'Welcome' },
    { id: 'ollama', label: 'Ollama Check' },
    { id: 'hermes', label: 'Hermes Docker' },
    { id: 'modules', label: 'Modules' },
    { id: 'done', label: 'Complete' },
  ]

  const currentIdx = steps.findIndex((s) => s.id === step)

  const goNext = () => {
    const idx = steps.findIndex((s) => s.id === step)
    if (idx < steps.length - 1) {
      setStep(steps[idx + 1].id)
    } else {
      onComplete()
    }
  }

  const goBack = () => {
    const idx = steps.findIndex((s) => s.id === step)
    if (idx > 0) setStep(steps[idx - 1].id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        className="w-[520px] max-h-[80vh] rounded-2xl border border-[#00d4ff22] bg-[#0a0a0f] overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-['Orbitron'] text-sm font-bold tracking-wider text-[#00d4ff]">
              HERMES SETUP
            </h2>
          </div>
          {/* Step indicators */}
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{
                    background: i <= currentIdx ? '#00d4ff' : '#ffffff15',
                    boxShadow: i <= currentIdx ? '0 0 6px #00d4ff' : 'none',
                  }}
                />
                {i < steps.length - 1 && (
                  <div
                    className="w-4 h-px"
                    style={{ background: i < currentIdx ? '#00d4ff33' : '#ffffff08' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              {step === 'welcome' && (
                <div className="space-y-4">
                  <h3 className="text-[13px] font-mono text-[#f0f0ff]">Welcome to HERMES</h3>
                  <p className="text-[10px] font-mono text-white/40 leading-relaxed">
                    This wizard will help you configure HERMES for first use.
                    We'll check your system for Ollama and Docker, and help you
                    select the AI modules you need.
                  </p>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-[9px] font-mono text-white/30">
                      <ChevronRight size={10} className="text-[#00d4ff]" />
                      Check if Ollama is installed locally
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-white/30">
                      <ChevronRight size={10} className="text-[#00d4ff]" />
                      Configure Hermes Docker connection
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-white/30">
                      <ChevronRight size={10} className="text-[#00d4ff]" />
                      Select AI modules for your use case
                    </div>
                  </div>
                </div>
              )}

              {step === 'ollama' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-[#00d4ff]" />
                    <h3 className="text-[13px] font-mono text-[#f0f0ff]">Ollama Local LLM</h3>
                  </div>
                  <p className="text-[10px] font-mono text-white/40 leading-relaxed">
                    Ollama lets you run AI models locally on your PC.
                    HERMES can use these models for chat, coding, image analysis, and more.
                  </p>

                  {ollamaInstalled === null ? (
                    <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02] text-center">
                      <p className="text-[9px] font-mono text-white/30 mb-3">
                        Check if Ollama is already installed on your system:
                      </p>
                      <button
                        onClick={() => {
                          // In real app, this calls Tauri command check_ollama_installed
                          setOllamaInstalled(false) // Simulated
                        }}
                        className="text-[9px] font-mono px-4 py-2 rounded border border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11]"
                      >
                        CHECK OLLAMA
                      </button>
                    </div>
                  ) : ollamaInstalled ? (
                    <div className="p-4 rounded-lg border border-[#22d3ee33] bg-[#22d3ee08] flex items-center gap-2">
                      <Check size={14} className="text-[#22d3ee]" />
                      <span className="text-[10px] font-mono text-[#22d3ee]">Ollama is installed!</span>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border border-[#ff2d5533] bg-[#ff2d5508] space-y-3">
                      <p className="text-[9px] font-mono text-white/40">
                        Ollama is not detected. Would you like to install it?
                      </p>
                      <button
                        onClick={() => {
                          // In real app, this calls Tauri command install_ollama
                          setOllamaInstalled(true) // Simulated
                        }}
                        className="text-[9px] font-mono px-4 py-2 rounded border border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] flex items-center gap-2"
                      >
                        <Download size={10} />
                        INSTALL OLLAMA
                      </button>
                      <p className="text-[8px] font-mono text-white/20">
                        Or download manually from https://ollama.com
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 'hermes' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Server size={16} className="text-[#00d4ff]" />
                    <h3 className="text-[13px] font-mono text-[#f0f0ff]">Hermes Docker Connection</h3>
                  </div>
                  <p className="text-[10px] font-mono text-white/40 leading-relaxed">
                    Hermes Agent runs in a Docker container with its own LLM models.
                    Connect to it for full agent orchestration and AI capabilities.
                  </p>

                  {dockerInstalled === null ? (
                    <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02] text-center">
                      <p className="text-[9px] font-mono text-white/30 mb-3">
                        Check if Docker Desktop is running:
                      </p>
                      <button
                        onClick={() => {
                          // In real app, calls Tauri command check_docker_running
                          setDockerInstalled(false) // Simulated
                        }}
                        className="text-[9px] font-mono px-4 py-2 rounded border border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11]"
                      >
                        CHECK DOCKER
                      </button>
                    </div>
                  ) : dockerInstalled ? (
                    <div className="p-4 rounded-lg border border-[#22d3ee33] bg-[#22d3ee08] space-y-2">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-[#22d3ee]" />
                        <span className="text-[10px] font-mono text-[#22d3ee]">Docker is running!</span>
                      </div>
                      <p className="text-[9px] font-mono text-white/30">
                        Enter the Hermes Docker URL (default: http://localhost:11434)
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02] space-y-2">
                      <p className="text-[9px] font-mono text-white/40">
                        Docker not detected. You can use Hermes without Docker by using local Ollama models instead.
                      </p>
                      <p className="text-[8px] font-mono text-white/20">
                        To use Docker: Install Docker Desktop from https://docker.com and start the Hermes container.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 'modules' && (
                <div className="space-y-4">
                  <h3 className="text-[13px] font-mono text-[#f0f0ff]">Select AI Modules</h3>
                  <p className="text-[10px] font-mono text-white/40">
                    Choose which AI capabilities you want. You can always add more later from Settings → Ollama.
                  </p>
                  <div className="space-y-2">
                    {[
                      { name: 'Coding Assistant', model: 'Qwen 2.5 Coder', checked: true },
                      { name: 'Vision (Image Reading)', model: 'Llama 3.2 Vision', checked: true },
                      { name: 'Chat / Conversation', model: 'Llama 3.2', checked: true },
                      { name: 'Reasoning', model: 'DeepSeek R1', checked: false },
                      { name: 'Image Generation', model: 'Stable Diffusion', checked: false },
                      { name: 'Speech-to-Text', model: 'Whisper', checked: false },
                    ].map((mod) => (
                      <label
                        key={mod.name}
                        className="flex items-center gap-3 p-2 rounded border border-white/5 hover:border-white/10 cursor-pointer"
                      >
                        <input type="checkbox" defaultChecked={mod.checked} className="accent-[#00d4ff]" />
                        <div>
                          <div className="text-[10px] font-mono text-[#f0f0ff]">{mod.name}</div>
                          <div className="text-[8px] font-mono text-white/25">{mod.model}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 'done' && (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-[#00d4ff] flex items-center justify-center mx-auto">
                    <Check size={32} className="text-[#00d4ff]" />
                  </div>
                  <h3 className="text-[13px] font-mono text-[#f0f0ff]">Setup Complete!</h3>
                  <p className="text-[10px] font-mono text-white/40">
                    HERMES is configured and ready. You can always adjust settings from the Settings panel.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/5">
          <button
            onClick={goBack}
            disabled={currentIdx === 0}
            className="flex items-center gap-1 text-[9px] font-mono text-white/30 hover:text-[#f0f0ff] disabled:opacity-20 transition-colors"
          >
            <ChevronLeft size={12} />
            BACK
          </button>
          <button
            onClick={goNext}
            className="flex items-center gap-1 text-[10px] font-mono px-4 py-2 rounded border border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-colors"
          >
            {step === 'done' ? 'FINISH' : 'NEXT'}
            <ChevronRight size={12} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}

