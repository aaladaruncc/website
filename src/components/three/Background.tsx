'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Sphere, Stars } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedSphere() {
  const sphereRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.2
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2
    }
  })

  return (
    <Sphere ref={sphereRef} args={[1, 32, 32]} position={[0, 0, 0]}>
      <meshStandardMaterial
        color="#666"
        wireframe
        transparent
        opacity={0.2}
      />
    </Sphere>
  )
}

export function Background() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <AnimatedSphere />
        <Stars
          radius={50}
          depth={50}
          count={1000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      </Canvas>
    </div>
  )
} 