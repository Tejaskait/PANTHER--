import React, { useEffect } from "react";
import Projectile from "./classes/Projectile.jsx";

export default function EventListeners({
  canvasRef,
  frontendProjectiles,
  frontendPlayers,
  socket,
}) {
  useEffect(() => {
    const canvas = canvasRef.current;

    // Device Pixel Ratio for scaling
    const devicePixelRatio = window.devicePixelRatio || 2;

    const handleClick = (event) => {
      const player = frontendPlayers[socket.id]; // Use the player object for the current socket
      if (!player) return; // Return early if the player is not defined

      const rect = canvas.getBoundingClientRect();
      // Adjust the click position by scaling according to the device pixel ratio
      const clickX = (event.clientX - rect.left) * devicePixelRatio;
      const clickY = (event.clientY - rect.top) * devicePixelRatio;

      // Calculate the angle for projectile trajectory
      const angle = Math.atan2(
        clickY - player.y, // Use player's position for calculating angle
        clickX - player.x
      );

      // Define velocity based on the angle and a fixed speed
      /*     const velocity = {
        x: Math.cos(angle) * 5,  // Use a constant speed for the projectile
        y: Math.sin(angle) * 5,
      };*/
      socket.emit("shoot", {
        x: player.x * devicePixelRatio,
        y: player.y * devicePixelRatio,
        angle
      });
      // Add the new projectile, with the starting position being the player's current position
      /*frontendProjectiles.push(
        new Projectile({
          x: player.x * devicePixelRatio, // Apply devicePixelRatio to ensure correct scale
          y: player.y * devicePixelRatio, // Apply devicePixelRatio to ensure correct scale
          radius: 5,
          color: "white",
          velocity,
        })
      );*/

      console.log("Projectiles:", frontendProjectiles);
    };

    // Add event listener to handle clicks on the canvas
    canvas.addEventListener("click", handleClick);

    // Cleanup the event listener on unmount
    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, [canvasRef, frontendProjectiles, frontendPlayers, socket]);

  return null; // This component doesn't render anything
}
