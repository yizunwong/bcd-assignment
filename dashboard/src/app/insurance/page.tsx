'use client'

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Leva, useControls } from 'leva'
import { useInsuranceStore, InsurancePlan } from '@/store/insurance'
import { InsuranceModels } from '@/components/InsuranceModels'

export default function InsurancePage() {
  const setSelectedPlan = useInsuranceStore((state) => state.setSelectedPlan)

  const { plan } = useControls('Insurance Selection', {
    plan: {
      options: {
        Basic: 'basic',
        Premium: 'premium',
        Platinum: 'platinum',
      },
    },
  })

  React.useEffect(() => {
    setSelectedPlan(plan as InsurancePlan)
  }, [plan, setSelectedPlan])

  return (
    <div className="w-full h-screen">
      <Leva collapsed />
      <Canvas camera={{ position: [2, 2, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls />
        <InsuranceModels />
      </Canvas>
    </div>
  )
}
