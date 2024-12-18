import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const PlayerMechanism = () => {
  const mountRef = useRef(null);
  const playerRef = useRef();
  const rangeRef = useRef();
  const dummyRef = useRef(null);
  const lineRef = useRef(null); // Reference for the line
  const [dummyPosition, setDummyPosition] = useState(null);
  const rangeRadius = 3;
  const isDragging = useRef(false); // Flag for dragging
  const mouseStart = useRef(null); // Store starting mouse position
  const lineRotation = useRef(0); // Store line rotation angle

  const handleButtonClick = () => {
    if (dummyPosition) {
      playerRef.current.position.set(dummyPosition.x, dummyPosition.y, 0);
      rangeRef.current.position.set(dummyPosition.x, dummyPosition.y, -0.1);

      // Remove the dummy and line after 2 seconds
      if (dummyRef.current || lineRef.current) {
        setTimeout(() => {
          if (dummyRef.current) {
            scene.remove(dummyRef.current);
            dummyRef.current = null;
          }
          if (lineRef.current) {
            scene.remove(lineRef.current);
            lineRef.current = null;
          }
          setDummyPosition(null);
        }, 2000);
      }
    } else {
      alert("Click to set the dummy player's location first!");
    }
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const aspect = window.innerWidth / window.innerHeight;
    const cameraSize = 10;
    const camera = new THREE.OrthographicCamera(
      -cameraSize * aspect,
      cameraSize * aspect,
      cameraSize,
      -cameraSize,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);

    const playerGeometry = new THREE.CircleGeometry(0.3, 32);
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set(0, 0, 0);
    playerRef.current = player;
    scene.add(player);

    const rangeGeometry = new THREE.CircleGeometry(rangeRadius, 64);
    const rangeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0099ff,
      transparent: true,
      opacity: 0.2,
    });
    const rangeCircle = new THREE.Mesh(rangeGeometry, rangeMaterial);
    rangeCircle.position.set(0, 0, -0.1);
    rangeRef.current = rangeCircle;
    scene.add(rangeCircle);

    const createDummyPlayer = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x =
        ((event.clientX - rect.left) / rect.width) * (camera.right - camera.left) +
        camera.left;
      const y =
        -((event.clientY - rect.top) / rect.height) * (camera.top - camera.bottom) +
        camera.top;

      const distance = Math.sqrt(
        Math.pow(x - player.position.x, 2) + Math.pow(y - player.position.y, 2)
      );
      if (distance <= rangeRadius) {
        if (dummyRef.current) {
          scene.remove(dummyRef.current);
        }

        // Create dummy
        const dummyGeometry = new THREE.CircleGeometry(0.3, 32);
        const dummyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const dummyPlayer = new THREE.Mesh(dummyGeometry, dummyMaterial);
        dummyPlayer.position.set(x, y, 0);
        scene.add(dummyPlayer);

        dummyRef.current = dummyPlayer;
        setDummyPosition({ x, y });

        // Add a line
        if (lineRef.current) {
          scene.remove(lineRef.current);
        }
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const lineGeometry = new THREE.BufferGeometry();

        const startPoint = new THREE.Vector3(x, y, 0);
        const endPoint = new THREE.Vector3(x, y + 1, 0);
        lineGeometry.setFromPoints([startPoint, endPoint]);

        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        lineRef.current = line;

        lineRotation.current = 0; // Reset rotation
      }
    };

    const onMouseDown = (event) => {
      if (!lineRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouseStart.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      isDragging.current = true;
    };

    const onMouseMove = (event) => {
      if (!isDragging.current || !lineRef.current) return;
    
      const rect = renderer.domElement.getBoundingClientRect();
    
      // Convert mouse position to normalized device coordinates (NDC)
      const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
      // Project NDC to world coordinates
      const mousePosition = new THREE.Vector3(ndcX, ndcY, 0).unproject(camera);
    
      const startPoint = dummyRef.current.position.clone();
      const dx = mousePosition.x - startPoint.x;
      const dy = mousePosition.y - startPoint.y;
    
      // Calculate the angle based on the mouse position
      lineRotation.current = Math.atan2(dy, dx);
    
      const lineLength = 3; // Fixed length for the line
      const endPoint = new THREE.Vector3(
        startPoint.x + Math.cos(lineRotation.current) * lineLength,
        startPoint.y + Math.sin(lineRotation.current) * lineLength,
        0
      );
    
      // Update the line geometry
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setFromPoints([startPoint, endPoint]);
    
      lineRef.current.geometry.dispose(); // Dispose old geometry
      lineRef.current.geometry = lineGeometry;
    };
    

    const onMouseUp = () => {
      isDragging.current = false;
    };

    renderer.domElement.addEventListener("click", createDummyPlayer);
    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);

    const handleResize = () => {
      const newAspect = window.innerWidth / window.innerHeight;
      camera.left = -cameraSize * newAspect;
      camera.right = cameraSize * newAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />
      <button
        onClick={handleButtonClick}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Move Player
      </button>
    </div>
  );
};

export default PlayerMechanism;
