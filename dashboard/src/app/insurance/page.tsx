'use client'

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { InsuranceSlider } from '@/components/InsuranceSlider'

export default function InsurancePage() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [2, 2, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls />
        <InsuranceSlider />
      </Canvas>
    </div>
  )
}
