import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const MapBoundary = () => {
  const mountRef = useRef(null);

  const boundaryPoints = [
    { x: 0, y: 615 },
    { x: 20, y: 615 },
    { x: 40, y: 615 },
    { x: 60, y: 615 },
    { x: 80, y: 615 },
    // Add all points extracted above here...
  ];

  useEffect(() => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const aspect = window.innerWidth / window.innerHeight;

    // Adjust the camera to fit the map
    const camera = new THREE.OrthographicCamera(
      -600 * aspect,
      600 * aspect,
      300,
      -300,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    // Scale down the boundary points for visibility
    const scaleFactor = 0.5;
    const points = boundaryPoints.map(
      (p) =>
        new THREE.Vector3(
          (p.x - 600) * scaleFactor, // Center the map horizontally
          (p.y - 300) * scaleFactor, // Center the map vertically
          0
        )
    );

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });

    const boundaryLine = new THREE.Line(geometry, material);
    scene.add(boundaryLine);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const newAspect = window.innerWidth / window.innerHeight;
      camera.left = -600 * newAspect;
      camera.right = 600 * newAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}
    />
  );
};

export default MapBoundary;
