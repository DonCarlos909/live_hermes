import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useHermesStore } from '../../store/hermes'

function ParticleField() {
  const count = 2000
  const meshRef = useRef<THREE.Points>(null)
  const mode = useHermesStore((s) => s.mode)

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5

      const isBlue = Math.random() > 0.3
      col[i * 3] = isBlue ? 0.0 : 1.0
      col[i * 3 + 1] = isBlue ? 0.83 : 0.17
      col[i * 3 + 2] = isBlue ? 1.0 : 0.33
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1

    const c = meshRef.current.geometry.attributes.color
    const pos = meshRef.current.geometry.attributes.position
    if (!c || !pos) return

    const t = state.clock.elapsedTime
    const isRed = mode === 'ctf'
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i)
      pos.setY(i, y + Math.sin(t + i * 0.1) * 0.002)

      const alpha = 0.3 + Math.sin(t * 2 + i * 0.5) * 0.3
      if (isRed) {
        c.setXYZ(i, alpha * 1.0, alpha * 0.1, alpha * 0.2)
      } else {
        const isBlue = i % 3 !== 0
        c.setXYZ(i, alpha * (isBlue ? 0.0 : 0.5), alpha * (isBlue ? 0.83 : 0.8), alpha * (isBlue ? 1.0 : 1.0))
      }
    }
    c.needsUpdate = true
    pos.needsUpdate = true
  })

  const particleSize = mode === 'ctf' ? 0.06 : 0.04

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function EnergyWaves() {
  const ref = useRef<THREE.Mesh>(null)
  const mode = useHermesStore((s) => s.mode)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.2)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.03 + Math.sin(t * 0.8) * 0.02
  })

  const color = mode === 'ctf' ? '#ff2d55' : mode === 'analysis' ? '#00d4ff' : '#8b5cf6'

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <ringGeometry args={[2, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>
    </Float>
  )
}

function DigitalRain() {
  const count = 40
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const speeds = useMemo(() => Array.from({ length: count }, () => 0.5 + Math.random() * 1.5), [])
  const xPositions = useMemo(() => Array.from({ length: count }, () => (Math.random() - 0.5) * 20), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const y = ((t * speeds[i] * 3 + i * 2) % 20) - 10
      dummy.position.set(xPositions[i], y, -8 - Math.random() * 5)
      dummy.scale.set(0.02, 0.5 + Math.sin(t + i) * 0.3, 1)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  )
}

export default function CyberBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <ParticleField />
        <EnergyWaves />
        <DigitalRain />
      </Canvas>
    </div>
  )
}
