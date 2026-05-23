import { motion } from 'framer-motion'
import AvatarCore from '../avatar/AvatarCore'
import CyberBackground from '../background/CyberBackground'

export default function MainArea() {
  return (
    <motion.main
      className="main-area relative flex-1 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Three.js Background */}
      <CyberBackground />

      {/* Avatar centered */}
      <div className="relative z-10 w-full h-full max-w-[500px] max-h-[500px]">
        <AvatarCore />
      </div>

      {/* Ambient glow behind avatar */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
    </motion.main>
  )
}
