import React from "react";

const Player = ({ position = [0, 0, 0], color = "blue" }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Player;
