import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Line } from '@react-three/drei'
import * as THREE from 'three'

const Node = ({ position, color }: { position: [number, number, number], color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.x = 1 + Math.sin(state.clock.getElapsedTime() * 2 + position[0]) * 0.1
      meshRef.current.scale.y = 1 + Math.sin(state.clock.getElapsedTime() * 2 + position[0]) * 0.1
      meshRef.current.scale.z = 1 + Math.sin(state.clock.getElapsedTime() * 2 + position[0]) * 0.1
    }
  })

  return (
    <mesh position={position} ref={meshRef}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
    </mesh>
  )
}

const Network = () => {
  const groupRef = useRef<THREE.Group>(null!)
  
  // Generate random nodes on a sphere
  const { nodes, lines } = useMemo(() => {
    const numNodes = 30
    const radius = 2
    const nodes: { position: [number, number, number], color: string }[] = []
    
    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / numNodes)
      const theta = Math.sqrt(numNodes * Math.PI) * phi
      
      const x = radius * Math.cos(theta) * Math.sin(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(phi)
      
      const color = i % 3 === 0 ? '#ef4444' : i % 2 === 0 ? '#eab308' : '#22c55e'
      nodes.push({ position: [x, y, z], color })
    }

    const lines: [number, number, number][][] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = new THREE.Vector3(...nodes[i].position).distanceTo(new THREE.Vector3(...nodes[j].position))
        if (dist < 1.5) {
          lines.push([nodes[i].position, nodes[j].position])
        }
      }
    }

    return { nodes, lines }
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <Node key={i} position={node.position} color={node.color} />
      ))}
      {lines.map((line, i) => (
        <Line 
          key={`line-${i}`} 
          points={line} 
          color="#3b82f6" 
          lineWidth={0.5} 
          transparent 
          opacity={0.2} 
        />
      ))}
    </group>
  )
}

export default function ExecutiveGlobe() {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden relative glass border-brand-500/30">
      <div className="absolute top-6 left-6 z-10">
        <h2 className="text-2xl font-display font-bold text-white mb-1">Global Organization Network</h2>
        <p className="text-slate-400 text-sm">Real-time organizational health & goal alignment</p>
      </div>
      
      <div className="absolute bottom-6 left-6 z-10 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
          <span className="text-xs text-slate-300">On Track</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_#eab308]"></div>
          <span className="text-xs text-slate-300">At Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"></div>
          <span className="text-xs text-slate-300">Critical</span>
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Network />
        
        <OrbitControls enableZoom={false} autoRotate={false} />
      </Canvas>
    </div>
  )
}
