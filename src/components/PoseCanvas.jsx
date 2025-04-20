

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { drawPose } from '../utils/drawingUtils';
import { analyzePose } from '../utils/rules';
import './PoseCanvas.css';

const PoseCanvas = ({ exercise, onLandmarks, onFeedback, canvasRef }) => {
  const webcamRef = useRef(null);
  const animationRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const [fps, setFps] = useState(0);
  const lastFpsUpdate = useRef(0);
  const frameCount = useRef(0);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await tf.ready();
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const landmarker = await PoseLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task",
              delegate: "GPU"
            },
            runningMode: "VIDEO",
            numPoses: 1
          }
        );
        poseLandmarkerRef.current = landmarker;
      } catch (error) {
        console.error("Failed to load models:", error);
      }
    };

    loadModels();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!exercise || !poseLandmarkerRef.current) return;

    let lastTime = 0;
    const fpsInterval = 1000 / 30; // Target 30 FPS

    const detectPose = async (timestamp) => {
      if (!webcamRef.current?.video) {
        animationRef.current = requestAnimationFrame(detectPose);
        return;
      }

      // Throttle to ~30 FPS
      const elapsed = timestamp - lastTime;
      if (elapsed < fpsInterval) {
        animationRef.current = requestAnimationFrame(detectPose);
        return;
      }
      lastTime = timestamp - (elapsed % fpsInterval);

      // Calculate FPS
      frameCount.current++;
      const now = performance.now();
      if (now - lastFpsUpdate.current >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / (now - lastFpsUpdate.current)));
        frameCount.current = 0;
        lastFpsUpdate.current = now;
      }

      try {
        const video = webcamRef.current.video;
        const results = poseLandmarkerRef.current.detectForVideo(video, performance.now());

        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0].map((landmark, i) => ({
            x: landmark.x * video.videoWidth,
            y: landmark.y * video.videoHeight,
            z: landmark.z,
            visibility: results.worldLandmarks?.[0]?.[i]?.visibility || 0,
            score: landmark.visibility,
          }));
          
          onLandmarks(landmarks);
          
          const feedback = analyzePose(landmarks, exercise);
          onFeedback(feedback);
          
          if (canvasRef.current) {
            drawPose(canvasRef.current, video, landmarks, feedback);
          }
        }
      } catch (error) {
        console.error("Pose detection error:", error);
      }

      animationRef.current = requestAnimationFrame(detectPose);
    };

    animationRef.current = requestAnimationFrame(detectPose);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [exercise, onFeedback, onLandmarks]);

  return (
    <div className="pose-canvas-container">
      <Webcam
        ref={webcamRef}
        className="webcam-feed"
        mirrored
        screenshotFormat="image/jpeg"
        videoConstraints={{ 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 30 }
        }}
        onUserMediaError={(err) => console.error("Webcam error:", err)}
      />
      <canvas
        ref={canvasRef}
        className="pose-canvas"
      />
      <div className="performance-info">
        FPS: {fps} | Exercise: {exercise || 'None'}
      </div>
    </div>
  );
};

export default PoseCanvas;