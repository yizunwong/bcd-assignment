import React from 'react'
import { useInsuranceStore } from '@/store/insurance'

export function InsuranceModels() {
  const selectedPlan = useInsuranceStore((state) => state.selectedPlan)

  return (
    <>
      {selectedPlan === 'basic' && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="lightgreen" />
        </mesh>
      )}
      {selectedPlan === 'premium' && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.75, 32, 32]} />
          <meshStandardMaterial color="gold" />
        </mesh>
      )}
      {selectedPlan === 'platinum' && (
        <mesh position={[0, 0, 0]}>
          <coneGeometry args={[0.8, 1.2, 32]} />
          <meshStandardMaterial color="silver" />
        </mesh>
      )}
    </>
  )
}
