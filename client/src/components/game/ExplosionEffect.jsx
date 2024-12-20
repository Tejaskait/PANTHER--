import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "./store";

const ExplosionEffect = ({ id, position }) => {
  const ref = useRef();
  const { explosionEffects, clearExplosion } = useStore();
  const active = explosionEffects[id];

  useFrame(() => {
    if (active && ref.current) {
      ref.current.scale.x += 0.1;
      ref.current.scale.y += 0.1;
      ref.current.scale.z += 0.1;

      if (ref.current.scale.x > 3) {
        clearExplosion(id);
      }
    } else if (ref.current) {
      ref.current.scale.set(0, 0, 0);
    }
  });

  return (
    <mesh position={position} ref={ref} scale={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="orange" transparent opacity={0.5} />
    </mesh>
  );
};

export default ExplosionEffect;
