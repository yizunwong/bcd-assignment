"use client";

import React, { useRef } from "react";
import { animated, useSpring } from "@react-spring/three";
import { useDrag } from "@use-gesture/react";
import { Text } from "@react-three/drei";
import { useInsuranceStore, InsurancePlan } from "@/store/insurance";

const plans: InsurancePlan[] = [
  "medical",
  "flight",
  "travel",
  "life",
  "accident",
];
const CARD_SPACING = 3;
const SCROLL_DAMPING = 0.005; // ✅ Works well between 0.15 – 0.3

const colors: Record<InsurancePlan, string> = {
  medical: "#90ee90",
  flight: "#add8e6",
  travel: "#ffc0cb",
  life: "#ffd580",
  accident: "#e1bee7",
};

export function InsuranceSlider() {
  const setSelectedPlan = useInsuranceStore((s) => s.setSelectedPlan);
  const dragOffset = useRef(0);
  const totalWidth = (plans.length - 1) * CARD_SPACING;

  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useDrag(({ movement: [mx], last }) => {
    const damped = mx * SCROLL_DAMPING;
    const newX = dragOffset.current + damped;
    const clampedX = Math.min(0, Math.max(-totalWidth, newX));

    api.start({ x: clampedX, immediate: true });

    if (last) {
      dragOffset.current = clampedX;

      // Optional: update visible plan
      const index = Math.round(Math.abs(clampedX) / CARD_SPACING);
      setSelectedPlan(plans[index]);
    }
  });

  return (
    <animated.group {...bind()} position-x={x}>
      {plans.map((plan, i) => (
        <group key={plan} position={[i * CARD_SPACING, 0, 0]}>
          <mesh>
            <planeGeometry args={[2, 2.5]} />
            <meshStandardMaterial color={colors[plan]} />
          </mesh>
          <Text
            position={[0, 0.6, 0.01]}
            fontSize={0.4}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {plan.toUpperCase()}
          </Text>
        </group>
      ))}
    </animated.group>
  );
}
