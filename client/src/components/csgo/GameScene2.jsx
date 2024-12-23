import React, { useRef, useEffect } from "react";
import Player from "./classes/Player.jsx";
import { io } from "socket.io-client";
import { input } from "framer-motion/client";
import gsap from "gsap";
export default function GameScene() {
  const canvasRef = useRef(null);
  const scoreRef = useRef(null);
  const devicePixelRatio = window.devicePixelRatio || 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    const scoreElement = scoreRef.current;
    const context = canvas.getContext("2d");
    const socket = io("http://localhost:3000", {
      withCredentials: true,
    });
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;

    const frontendPlayers = {};

    // Listen for player updates from the server
    socket.on("updatePlayers", (backendPlayers) => {
      for (const id in backendPlayers) {
        const backendPlayer = backendPlayers[id];
        if (!frontendPlayers[id]) {
          frontendPlayers[id] = new Player(
            backendPlayer.x,
            backendPlayer.y,
            10,
            backendPlayer.color
          );
        } else {
          if (id === socket.id) {
            frontendPlayers[id].x = backendPlayer.x;
            frontendPlayers[id].y = backendPlayer.y;
            const lastBackendInputIndex = playerInputs.findIndex((input) => {
              return backendPlayers.sequenceNumber === input.sequenceNumber;
            });
            if (lastBackendInputIndex > -1) {
              playerInputs.splice(0, lastBackendInputIndex + 1);
              playerInputs.forEach((input) => {
                frontendPlayers[id].x += input.dx;
                frontendPlayers[id].y += input.dy;
              });
            }
          } else {
            
            gsap.to(frontendPlayers[id], {
              x: backendPlayer.x,
              y: backendPlayer.y,
              duration: 0.015,
              ease: "power2.inOut",
            });
          }
        }
      }
      for (const id in frontendPlayers) {
        if (!backendPlayers[id]) {
          delete frontendPlayers[id];
        }
      }
    });

    /*  // Handle player movement on click
    window.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = (event.clientX - rect.left) * devicePixelRatio;
      const clickY = (event.clientY - rect.top) * devicePixelRatio;

      // Update the position of the local player
      const socketId = socket.id;
      if (frontendPlayers[socketId]) {
        frontendPlayers[socketId].x = clickX;
        frontendPlayers[socketId].y = clickY;

        // Notify the server of the position change
        socket.emit("movePlayer", { x: clickX, y: clickY });
      }
    });*/

    // Animation loop
    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);
      context.fillStyle = "rgba(0, 0, 0, 0.1)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      for (const id in frontendPlayers) {
        const frontendPlayer = frontendPlayers[id];
        frontendPlayer.draw(context);
      }
    }

    animate();
    const keys = {
      w: {
        pressed: false,
      },
      a: {
        pressed: false,
      },
      s: {
        pressed: false,
      },
      d: {
        pressed: false,
      },
    };
    const speed = 3;
    const playerInputs = [];
    let sequenceNumber = 0;
    setInterval(() => {
      if (keys.w.pressed) {
        sequenceNumber++;
        playerInputs.push({ sequenceNumber, dx: 0, dy: -speed });
        frontendPlayers[socket.id].y -= speed;
        socket.emit("keydown", { keycode: "KeyW", sequenceNumber });
      }
      if (keys.a.pressed) {
        sequenceNumber++;
        playerInputs.push({ sequenceNumber, dx: -speed, dy: 0 });
        frontendPlayers[socket.id].x -= speed;
        socket.emit("keydown", { keycode: "KeyA", sequenceNumber });
      }
      if (keys.s.pressed) {
        sequenceNumber++;
        playerInputs.push({ sequenceNumber, dx: 0, dy: speed });
        frontendPlayers[socket.id].y += speed;
        socket.emit("keydown", { keycode: "KeyS", sequenceNumber });
      }
      if (keys.d.pressed) {
        sequenceNumber++;
        playerInputs.push({ sequenceNumber, dx: speed, dy: 0 });
        frontendPlayers[socket.id].x += speed;
        socket.emit("keydown", { keycode: "KeyD", sequenceNumber });
      }
    }, 15);
    window.addEventListener("keydown", (event) => {
      if (!frontendPlayers[socket.id]) return;
      switch (event.code) {
        case "KeyW":
          keys.w.pressed = true;

          break;
        case "KeyA":
          keys.a.pressed = true;
          break;
        case "KeyS":
          keys.s.pressed = true;
          break;
        case "KeyD":
          keys.d.pressed = true;
          break;
      }
    });

    window.addEventListener("keyup", (event) => {
      if (!frontendPlayers[socket.id]) return;
      switch (event.code) {
        case "KeyW":
          keys.w.pressed = false;

          break;
        case "KeyA":
          keys.a.pressed = false;
          break;
        case "KeyS":
          keys.s.pressed = false;
          break;
        case "KeyD":
          keys.d.pressed = false;
          break;
      }
    });

    return () => {
      window.removeEventListener("click", () => {});
      cancelAnimationFrame(animationId);
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      ></canvas>
      <div
        ref={scoreRef}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          color: "white",
          fontSize: "20px",
        }}
      >
        Score: 0
      </div>
    </div>
  );
}
