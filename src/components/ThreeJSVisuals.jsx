import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './ThreeJSVisuals.css';

const Annotations = ({ landmarks, feedback, canvasRef }) => {
  const groupRef = useRef();
  const arrowsRef = useRef([]);

  useFrame(() => {
    if (!groupRef.current || !canvasRef.current) return;
    
    // Position the annotations relative to the canvas
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    groupRef.current.position.x = (rect.width / -2) + 20;
    groupRef.current.position.y = (rect.height / 2) - 20;
  });

  useEffect(() => {
    if (!feedback || !feedback.issues.length) return;
    
    // Clear previous arrows
    arrowsRef.current.forEach(arrow => {
      if (arrow.parent) arrow.parent.remove(arrow);
    });
    arrowsRef.current = [];
    
    feedback.issues.forEach(issue => {
      if (!issue.keypoints || !landmarks) return;
      
      issue.keypoints.forEach(kpIndex => {
        const landmark = landmarks[kpIndex];
        if (!landmark || landmark.score < 0.3) return;
        
        const arrow = new THREE.ArrowHelper(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(landmark.x, -landmark.y, 0),
          0.1,
          0xff0000,
          0.05,
          0.025
        );
        
        groupRef.current.add(arrow);
        arrowsRef.current.push(arrow);
      });
    });
  }, [feedback, landmarks]);

  return (
    <group ref={groupRef}>
      {feedback?.issues.map((issue, i) => (
        <Float key={i} speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
          <Text
            position={[0, i * -0.5, 0]}
            color="red"
            fontSize={0.2}
            maxWidth={2}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="left"
            anchorX="left"
            anchorY="middle"
          >
            {issue.message}
          </Text>
        </Float>
      ))}
    </group>
  );
};

const ThreeJSVisuals = ({ landmarks, feedback, canvasRef }) => {
  return (
    <div className="threejs-container">
      <Canvas orthographic camera={{ position: [0, 0, 5], zoom: 100 }}>
        <ambientLight intensity={0.5} />
        <Annotations landmarks={landmarks} feedback={feedback} canvasRef={canvasRef} />
      </Canvas>
    </div>
  );
};

export default ThreeJSVisuals;