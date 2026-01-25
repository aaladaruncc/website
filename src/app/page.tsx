'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'

const COLORS = {
  carbon: '#2f2f2f',
  oxygen: '#e84b4b',
  nitrogen: '#3b6cff',
  hydrogen: '#f5f5f5',
}

type AtomType = 'carbon' | 'oxygen' | 'nitrogen' | 'hydrogen'

type Atom = {
  id: string
  type: AtomType
  position: [number, number, number]
  size: number
}

type Bond = {
  id: string
  start: [number, number, number]
  end: [number, number, number]
  radius?: number
}

function AtomMesh({ atom }: { atom: Atom }) {
  const materialProps =
    atom.type === 'oxygen'
      ? { emissive: '#ff7b7b', emissiveIntensity: 0.35 }
      : atom.type === 'nitrogen'
        ? { emissive: '#7aa2ff', emissiveIntensity: 0.3 }
        : atom.type === 'hydrogen'
          ? { emissive: '#ffffff', emissiveIntensity: 0.12 }
          : { emissive: '#111111', emissiveIntensity: 0.08 }

  return (
    <mesh position={atom.position}>
      <sphereGeometry args={[atom.size, 32, 32]} />
      <meshPhysicalMaterial
        color={COLORS[atom.type]}
        roughness={0.18}
        metalness={0.12}
        clearcoat={0.6}
        clearcoatRoughness={0.2}
        {...materialProps}
      />
    </mesh>
  )
}

function BondMesh({ bond }: { bond: Bond }) {
  const { position, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...bond.start)
    const end = new THREE.Vector3(...bond.end)
    const mid = start.clone().add(end).multiplyScalar(0.5)
    const dir = end.clone().sub(start)
    const len = dir.length()
    const quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
    return { position: mid, quaternion, length: len }
  }, [bond.end, bond.start])

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[bond.radius ?? 0.06, bond.radius ?? 0.06, length, 20]} />
      <meshStandardMaterial color="#8a8f98" roughness={0.45} metalness={0.15} />
    </mesh>
  )
}

function DopamineMolecule() {
  const groupRef = useRef<THREE.Group>(null)
  const spinAxis = useMemo(() => new THREE.Vector3(0.35, 1, 0.15).normalize(), [])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotateOnAxis(spinAxis, delta * 0.7)
    }
  })

  const { atoms, bonds } = useMemo(() => {
    const ringRadius = 1.2
    const ring = Array.from({ length: 6 }).map((_, i) => {
      const angle = (Math.PI / 3) * i
      return [Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0] as [number, number, number]
    })

    const atoms: Atom[] = ring.map((pos, i) => ({
      id: `c${i}`,
      type: 'carbon',
      position: pos,
      size: 0.22,
    }))

    const ch2a: [number, number, number] = [ring[0][0] + 1.05, ring[0][1] + 0.05, 0.2]
    const ch2b: [number, number, number] = [ch2a[0] + 0.85, ch2a[1] + 0.2, 0.3]
    const n: [number, number, number] = [ch2b[0] + 0.7, ch2b[1] + 0.1, 0.2]

    const o1: [number, number, number] = [ring[2][0] + 0.1, ring[2][1] + 0.9, 0.35]
    const o2: [number, number, number] = [ring[3][0] - 0.7, ring[3][1] + 0.7, -0.2]

    atoms.push(
      { id: 'ch2a', type: 'carbon', position: ch2a, size: 0.2 },
      { id: 'ch2b', type: 'carbon', position: ch2b, size: 0.2 },
      { id: 'n', type: 'nitrogen', position: n, size: 0.23 },
      { id: 'o1', type: 'oxygen', position: o1, size: 0.2 },
      { id: 'o2', type: 'oxygen', position: o2, size: 0.2 }
    )

    const bonds: Bond[] = []
    for (let i = 0; i < 6; i += 1) {
      bonds.push({
        id: `bond-ring-${i}`,
        start: ring[i],
        end: ring[(i + 1) % 6],
        radius: 0.05,
      })
    }

    bonds.push(
      { id: 'bond-chain-1', start: ring[0], end: ch2a, radius: 0.05 },
      { id: 'bond-chain-2', start: ch2a, end: ch2b, radius: 0.05 },
      { id: 'bond-chain-3', start: ch2b, end: n, radius: 0.05 },
      { id: 'bond-oh-1', start: ring[2], end: o1, radius: 0.04 },
      { id: 'bond-oh-2', start: ring[3], end: o2, radius: 0.04 }
    )

    return { atoms, bonds }
  }, [])

  return (
    <group ref={groupRef} scale={0.72} position={[-0.2, 0, -0.2]}>
      {bonds.map((bond) => (
        <BondMesh key={bond.id} bond={bond} />
      ))}
      {atoms.map((atom) => (
        <AtomMesh key={atom.id} atom={atom} />
      ))}
    </group>
  )
}

function DopamineScene() {
  return (
    <div className="relative -mt-16 h-[220px] w-full max-w-[240px] overflow-hidden rounded-3xl bg-transparent">
      <Canvas
        camera={{ position: [0.2, 0.1, 9.2], fov: 35 }}
        dpr={[1, 1.8]}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 4, 2]} intensity={0.8} color="#fff4e8" />
        <pointLight position={[-3, -2, 4]} intensity={0.55} color="#cbd5ff" />
        <pointLight position={[2.5, -3, -2]} intensity={0.35} color="#ffffff" />
        <DopamineMolecule />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  )
}

export default function Home() {
  return (
    <main className="container-minimal">
      <section className="space-y-6 text-base text-neutral-800">
        <p className="text-lg font-medium">Aryan Aladar</p>
        <p>
          Hey, I’m Aryan. I like making things, going down rabbit holes, and figuring stuff out as I go. Most of my time is spent learning, tinkering, and chasing ideas that seem interesting enough to keep me up at night.
        </p>
        <p>
          I try to keep my days simple: make something, learn something, then write down what surprised me. I’m drawn to ideas that feel a little unfinished, the ones that get better when you keep tugging on the thread.
        </p>
        <p>
          Right now I’m building{" "}
          <a
            className="underline underline-offset-4 decoration-neutral-300 transition hover:text-neutral-900 hover:decoration-neutral-700"
            href="https://useswarm.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            useswarm.co
          </a>
          .
        </p>
      </section>

      <section className="mt-14 flex flex-col gap-8 text-sm text-neutral-700 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <p className="text-sm text-neutral-700">
            <a
              className="underline underline-offset-4 decoration-neutral-300 transition hover:text-neutral-900 hover:decoration-neutral-700"
              href="https://linkedin.com/in/aladar"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            {" / "}
            <a
              className="underline underline-offset-4 decoration-neutral-300 transition hover:text-neutral-900 hover:decoration-neutral-700"
              href="https://github.com/aaladaruncc"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            {" / "}
            <a
              className="underline underline-offset-4 decoration-neutral-300 transition hover:text-neutral-900 hover:decoration-neutral-700"
              href="/research"
            >
              Research
            </a>
            {" / "}
            <a
              className="underline underline-offset-4 decoration-neutral-300 transition hover:text-neutral-900 hover:decoration-neutral-700"
              href="/blog"
            >
              Blog
            </a>
          </p>
          <p>
            <span className="font-semibold text-neutral-900">Hobbies:</span>{" "}
            Reading, Skiing, Pickleball, Tennis, Soccer, Spikeball (Used to Play D1), and Guitar.
          </p>
          <p>
            <span className="font-semibold text-neutral-900">Mountains Skied:</span> 5
          </p>
        </div>
        <DopamineScene />
      </section>
    </main>
  )
}
