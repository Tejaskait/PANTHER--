import React, { useRef, useEffect } from "react";
import Player from "./classes/Player.jsx";
import { io } from "socket.io-client";
import { input } from "framer-motion/client";
import gsap from "gsap";
import Projectile from "./classes/Projectile.jsx";
import EventListeners from "./eventListeners.jsx";
export default function GameScene() {
  
  const canvasRef = useRef(null);
  const scoreRef = useRef(null);
  const devicePixelRatio = window.devicePixelRatio || 2;
  const frontendPlayers = {};
  const frontendProjectiles = {};
  const socket = io("http://localhost:3000", {
    withCredentials: true,
  });

  useEffect(() => {

    
    const canvas = canvasRef.current;
    const scoreElement = scoreRef.current;
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    const playerUsernameForm = document.querySelector("#playerusername");
    const handleFormSubmit = (event) => {
      event.preventDefault();
      playerUsernameForm.style.display = 'none'
      const usernameInput = document.querySelector("#usernameinput");
      if (usernameInput) {
        const username = usernameInput.value.trim();
        if (username) {
          console.log("Submitted username:", username);
        } else {
          console.log("Please enter a username.");
        }
        socket.emit('initGame', {username,    width: canvas.width,
          height: canvas.height,
          devicePixelRatio,})
      }
      
    };
    if (playerUsernameForm) {
     
      playerUsernameForm.addEventListener("submit", handleFormSubmit);
    }
   
    socket.on("updateProjectiles", (backendProjectiles) => {
      for (const id in backendProjectiles) {
        const backendProjectile = backendProjectiles[id];

        if (!frontendProjectiles[id]) {
          // Check if the player exists in frontendPlayers
          const player = frontendPlayers[backendProjectile.playerId];

          if (!player) {
            continue; // Skip creating projectile if player not found
          }

          frontendProjectiles[id] = new Projectile({
            x: backendProjectile.x * devicePixelRatio, // Apply devicePixelRatio to ensure correct scale
            y: backendProjectile.y * devicePixelRatio, // Apply devicePixelRatio to ensure correct scale
            radius: 5,
            color: player.color, // Now it's safe to access player.color
            velocity: backendProjectile.velocity,
          });
        } else {
          frontendProjectiles[id].x += backendProjectiles[id].velocity.x;
          frontendProjectiles[id].y += backendProjectiles[id].velocity.y;
        }
      }
      for (const frontendProjectileId in frontendProjectiles) {
        if (!backendProjectiles[frontendProjectileId]) {
          delete frontendProjectiles[frontendProjectileId];
        }
      }
    });
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
          document.querySelector(
            "#playerLabel"
          ).innerHTML += `<div data-id='${id}' data-score='${backendPlayer.score}'>${backendPlayer.username}: ${backendPlayer.score}</div>`;
        } else {
          document.querySelector(
            `div [data-id='${id}']`
          ).innerHTML = ` ${backendPlayer.username}:${backendPlayer.score}`;
          document
            .querySelector(`div [data-id='${id}']`)
            .setAttribute("data-score", backendPlayer.score);
          const parentDiv = document.querySelector("#playerLabel");
          const childDiv = Array.from(parentDiv.querySelectorAll("div"));
          childDiv.sort((a, b) => {
            const scoreA = Number(a.getAttribute("data-score"));
            const scoreB = Number(b.getAttribute("data-score"));
            return scoreB - scoreA;
          });
          childDiv.forEach(div => {
            parentDiv.removeChild(div);
            parentDiv.appendChild(div);
          })
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
          const divDelete = document.querySelector(`div [data-id='${id}']`);
          divDelete.parentNode.removeChild(divDelete);
          if(id === socket.id) {
            playerUsernameForm.style.display = 'block';

          }
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
      for (const id in frontendProjectiles) {
        const frontendProjectile = frontendProjectiles[id];
        frontendProjectile.draw(context);
      }
      /*  for (let i = frontendProjectiles.length - 1; i >= 0; i--) {
        const frontendProjectile = frontendProjectiles[i];
        frontendProjectile.update();
        frontendProjectile.draw(context); // Add this line to draw the projectile
      }
        */
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
      if (playerUsernameForm) {
        playerUsernameForm.removeEventListener("submit", handleFormSubmit);
      }
    };
  }, []);

  return (
    <div >
      {/* Username Boilerplate */}
      <form
        id="playerusername"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "8px",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input
          id="usernameinput"
          type="text"
          placeholder="Enter username"
          style={{
            padding: "5px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "5px 10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>

      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
      ></canvas>
      <div
        ref={scoreRef}
        className="font-nmregular font-[1vw] mb-8px "
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          color: "white",
  
          userSelect: "none",
          background: "rgba(0,0,0,0.7)",
        }}
      >
        Leaderboard
        
        <div id="playerLabel" ref={scoreRef}>
          
        </div>
      </div>
   
      <EventListeners
        canvasRef={canvasRef}
        frontendProjectiles={frontendProjectiles}
        frontendPlayers={frontendPlayers} // Pass this prop
        socket={socket}
      />
    </div>
  );
  
}
