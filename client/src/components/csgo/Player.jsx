import React, { useRef, useEffect } from "react";

const Player = ({ x, y, radius, color }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    const drawPlayer = () => {
      c.beginPath();
      c.arc(x, y, radius, 0, Math.PI * 2, false);
      c.fillStyle = color;
      c.fill();
    };
  
    // Animate players
    const animate = () => {
      c.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      drawPlayer(); // Draw player
      requestAnimationFrame(animate);
    };
  
    animate();
  }, [x, y, radius, color]);
  return <canvas ref={canvasRef} />;
};

export default Player;
