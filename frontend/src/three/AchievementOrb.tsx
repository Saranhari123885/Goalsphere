import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Environment, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const Orb = ({ progress }: { progress: number }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<any>(null!)

  // Color interpolation based on progress (0-100)
  // 0% -> Red, 50% -> Yellow, 100% -> Green
  const color = useMemo(() => {
    const c = new THREE.Color()
    if (progress < 50) {
      c.lerpColors(new THREE.Color('#ef4444'), new THREE.Color('#eab308'), progress / 50)
    } else {
      c.lerpColors(new THREE.Color('#eab308'), new THREE.Color('#22c55e'), (progress - 50) / 50)
    }
    return c
  }, [progress])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
    if (materialRef.current) {
      materialRef.current.distort = THREE.MathUtils.lerp(
        materialRef.current.distort,
        0.2 + (progress / 100) * 0.4,
        0.05
      )
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
      <MeshDistortMaterial
        ref={materialRef}
        color={color}
        envMapIntensity={2}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.8}
        roughness={0.2}
        speed={2}
      />
    </Sphere>
  )
}

export default function AchievementOrb({ progress = 0 }: { progress?: number }) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Environment preset="city" />
        
        <Orb progress={progress} />
        
        {/* Particle effects reduced for performance */}
        <Sparkles 
          count={Math.floor(progress / 5)} 
          scale={5} 
          size={1.5} 
          speed={0.2} 
          opacity={0.3} 
          color="#ffffff" 
        />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
