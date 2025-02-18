'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const Particle = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-foreground/20"
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.8, 0],
      scale: [0, 1.5, 0],
      y: [0, -200],
      x: [-100, 100, -100],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
)

export function BackgroundAnimation() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-[800px] h-[800px]"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <Particle key={i} delay={i * 0.3} />
          ))}
        </motion.div>
      </div>
    </div>
  )
} 