import AvatarCore from '../avatar/AvatarCore'

export default function MainArea() {
  return (
    <main
      style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(ellipse at 50% 40%, #0a1a30 0%, #040810 100%)',
          zIndex: 0,
        }}
      />

      {/* Avatar */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          maxWidth: 480,
          maxHeight: 480,
        }}
      >
        <AvatarCore />
      </div>

      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,232,255,0.04) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
    </main>
  )
}
