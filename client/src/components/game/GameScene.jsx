import React from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import PlayerWithDummyAndBullets from "./PlayerWithDummyAndBullets";
import { useStore } from "./store";

const playerPositions = [
  { id: 1, position: [-8, 0, 8], color: "blue" },
  { id: 2, position: [-4, 0, 8], color: "blue" },
  { id: 3, position: [0, 0, 8], color: "blue" },
  { id: 4, position: [4, 0, 8], color: "blue" },
  { id: 5, position: [8, 0, 8], color: "blue" },
  { id: 6, position: [-8, 0, -8], color: "red" },
  { id: 7, position: [-4, 0, -8], color: "red" },
  { id: 8, position: [0, 0, -8], color: "red" },
  { id: 9, position: [4, 0, -8], color: "red" },
  { id: 10, position: [8, 0, -8], color: "red" },
];

const GameScene = () => {
  const { fireBullets } = useStore();

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* Canvas */}
      <Canvas
        camera={{
          position: [0, 23, 0],
          fov: 50,
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[100, 100, -5]} intensity={3} />

        {playerPositions.map((player) => (
          <PlayerWithDummyAndBullets
            key={player.id}
            id={player.id}
            position={player.position}
            color={player.color}
          />
        ))}

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="black" />
        </mesh>

        <Environment preset="sunset" />
      </Canvas>

      {/* Player Buttons on Left */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {playerPositions.slice(0, 5).map((player) => (
          <button
            key={player.id}
            onClick={() => fireBullets(player.id)}
            style={{
              padding: "10px 20px",
              background: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Fire Player {player.id}'s Bullets
          </button>
        ))}
      </div>

      {/* Enemy Buttons on Right */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {playerPositions.slice(5).map((player) => (
          <button
            key={player.id}
            onClick={() => fireBullets(player.id)}
            style={{
              padding: "10px 20px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Fire Player {player.id}'s Bullets
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameScene;
