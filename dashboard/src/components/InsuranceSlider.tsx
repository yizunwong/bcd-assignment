import React, { useRef, useState } from 'react'
import * as THREE from "three"
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useInsuranceStore, InsurancePlan } from '@/store/insurance'

// distance between items
const SLIDE_WIDTH = 2
const plans: InsurancePlan[] = ['basic', 'premium', 'platinum']

export function InsuranceSlider() {
  const group = useRef<THREE.Group>(null!)
  const setSelectedPlan = useInsuranceStore((state) => state.setSelectedPlan)
  const [index, setIndex] = useState(0)

  const prev = () => {
    setIndex((i) => (i + plans.length - 1) % plans.length)
  }

  const next = () => {
    setIndex((i) => (i + 1) % plans.length)
  }

  useFrame((state, delta) => {
    if (group.current) {
      const targetX = -index * SLIDE_WIDTH
      group.current.position.x += (targetX - group.current.position.x) * 5 * delta
    }
  })

  React.useEffect(() => {
    setSelectedPlan(plans[index])
  }, [index, setSelectedPlan])

  return (
    <>
      <group ref={group}>
        {/* Basic - Cube */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="lightgreen" />
        </mesh>
        {/* Premium - Sphere */}
        <mesh position={[SLIDE_WIDTH, 0, 0]}>
          <sphereGeometry args={[0.75, 32, 32]} />
          <meshStandardMaterial color="gold" />
        </mesh>
        {/* Platinum - Cone */}
        <mesh position={[SLIDE_WIDTH * 2, 0, 0]}>
          <coneGeometry args={[0.8, 1.2, 32]} />
          <meshStandardMaterial color="silver" />
        </mesh>
      </group>
      {/* Simple controls */}
      <Html position={[0, -1.5, 0]} center>
        <div className="flex space-x-4">
          <button
            onClick={prev}
            className="px-2 py-1 bg-gray-200 rounded-md text-black"
          >
            Prev
          </button>
          <button
            onClick={next}
            className="px-2 py-1 bg-gray-200 rounded-md text-black"
          >
            Next
          </button>
        </div>
      </Html>
    </>
  )
}
