import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { useStore } from "./store";

const PlayerWithDummyAndBullets = ({ id, position, color }) => {
  const dummyRef = useRef();
  const bulletRefs = [useRef(), useRef()];
  const { dummyLocations, bullets, setDummyLocation, setBullet, bulletStates, updatePlayerHP, resetBulletStates } = useStore();

  const dummyPosition = dummyLocations[id] || position;
  const bulletPositions = {
    1: bullets[id]?.[1] || [dummyPosition[0] + 1.5, 0, dummyPosition[2]],
    2: bullets[id]?.[2] || [dummyPosition[0] - 1.5, 0, dummyPosition[2]],
  };

  const bindDummy = useDrag(({ offset: [x, y] }) => {
    const dx = x / 50;
    const dz = y / 50;

    const distance = Math.sqrt(dx ** 2 + dz ** 2);
    if (distance <= 3) {
      setDummyLocation(id, [position[0] + dx, 0, position[2] + dz]);
    }
  });

  const bindBullet = (bulletIndex) =>
    useDrag(({ offset: [x, y] }) => {
      const dx = x / 50;
      const dz = y / 50;

      const distance = Math.sqrt(dx ** 2 + dz ** 2);
      if (distance <= 3) {
        setBullet(id, bulletIndex, [
          dummyPosition[0] + dx,
          0,
          dummyPosition[2] + dz,
        ]);
      }
    });

  useFrame(() => {
    const bulletState = bulletStates[id] || {};
    [1, 2].forEach((bulletIndex) => {
      if (bulletState[bulletIndex] === "firing") {
        const bulletRef = bulletRefs[bulletIndex - 1];
        const direction = [
          bulletPositions[bulletIndex][0] - dummyPosition[0],
          0,
          bulletPositions[bulletIndex][2] - dummyPosition[2],
        ];
        const magnitude = Math.sqrt(direction[0] ** 2 + direction[2] ** 2);
        const normalizedDir = [direction[0] / magnitude, 0, direction[2] / magnitude];

        bulletRef.current.position.x += normalizedDir[0] * 0.2;
        bulletRef.current.position.z += normalizedDir[2] * 0.2;

        const targetId = id <= 5 ? id + 5 : id - 5;
        const targetPos = dummyLocations[targetId];

        if (
          targetPos &&
          Math.hypot(
            bulletRef.current.position.x - targetPos[0],
            bulletRef.current.position.z - targetPos[2]
          ) < 0.5
        ) {
          updatePlayerHP(targetId, 50);
          resetBulletStates(id);
        }
      }
    });
  });

  return (
    <>
      <mesh position={position}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh {...bindDummy()} position={dummyPosition} ref={dummyRef} scale={[1, 1, 1]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} />
      </mesh>

      {[1, 2].map((bulletIndex) => (
        <mesh
          key={bulletIndex}
          {...bindBullet(bulletIndex)()}
          position={bulletPositions[bulletIndex]}
          ref={bulletRefs[bulletIndex - 1]}
          scale={[0.3, 0.3, 0.3]}
        >
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={bulletIndex === 1 ? "yellow" : "orange"} />
        </mesh>
      ))}
    </>
  );
};

export default PlayerWithDummyAndBullets;
