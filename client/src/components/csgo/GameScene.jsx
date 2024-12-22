import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// Initialize socket connection
const socket = io("http://localhost:3000", {
  withCredentials: true,
});

const GameScene = () => {
  const [players, setPlayers] = useState({}); // State to store all players
  const canvasRef = useRef(null);

  useEffect(() => {
    // Listen for updates from the server
    socket.on("updatePlayers", (backendPlayers) => {
      console.log("Received players from backend:", backendPlayers);
      setPlayers(backendPlayers); // Update players in state
    });

    // Log connection
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drawPlayers = () => {
      c.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      Object.values(players).forEach((player) => {
        c.beginPath();
        c.arc(player.x, player.y, player.radius, 0, Math.PI * 2, false);
        c.fillStyle = player.color;
        c.fill();
      });
    };

    const animate = () => {
      drawPlayers();
      requestAnimationFrame(animate);
    };

    animate();
  }, [players]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        background: "black", // Set background for better contrast
        width: "100vw",
        height: "100vh",
      }}
    />
  );
};

export default GameScene;
