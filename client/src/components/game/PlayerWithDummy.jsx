import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { useStore } from "./store";

const PlayerWithDummy = ({ id, position, color }) => {
  const dummyRef = useRef();
  const { dummyLocations, setDummyLocation } = useStore();

  // Get the dummy location for this player
  const dummyPosition = dummyLocations[id] || position;

  // Drag gesture for dummy location
  const bind = useDrag(({ offset: [x, y] }) => {
    const dx = x / 50; // Scale dragging to world units
    const dz = y / 50;

    const distance = Math.sqrt(dx ** 2 + dz ** 2);
    if (distance <= 3) {
      setDummyLocation(id, [position[0] + dx, 0, position[2] + dz]);
    }
  });

  return (
    <>
      {/* Player */}
      <mesh position={position}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Dummy Location */} 
      <mesh
        {...bind()}
        position={dummyPosition} 
        ref={dummyRef}
        scale={[1, 1, 1]}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </>
  );
};

export default PlayerWithDummy;
