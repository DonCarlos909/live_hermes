import AvatarCore from '../avatar/AvatarCore'

export default function MainArea() {
  return (
    <main style={{
      flex: 1, position: 'relative', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', minWidth: 0,
    }}>
      {/* Starfield — deeper space */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 50% 45%, #0c1a32 0%, #050810 70%)',
      }} />

      {/* Subtle grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(rgba(255,170,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,170,0,0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Avatar */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%', maxWidth: 460, maxHeight: 460 }}>
        <AvatarCore />
      </div>

      {/* Ambient glow — amber tint */}
      <div style={{
        position: 'absolute', zIndex: 1, width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,170,0,0.04) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />
    </main>
  )
}
