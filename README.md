Real-Time AI-Based Exercise Evaluation Web App

🎯 Objective:
Building a real-time, browser-based fitness application using MediaPipe Pose Landmarker and Three.js.
This app allow users to choose between Squats and Push-Ups, detect improper posture in different phases using rule-based logic, and visually indicate problems through colored keypoints and 3D annotations.

✅ Core Functional Requirements
📸 Pose Detection
Use MediaPipe Pose Landmarker (Web) for real-time webcam-based pose tracking.

Exercise Selection UI
Implement two buttons:

Start Squats

Start Push-Ups

Each button initiating detection and evaluation logic specific to the selected exercise.

📏 Rule-Based Posture Evaluation
For each exercise:

Breaks it into phases like descent and ascent for Squats

Using simple rule-based checks like:

Squats: Back angle too far forward, knees not bent enough

Push-Ups: Improper elbow angle, chest not lowered, back sagging

🎨 Visual Feedback:

🔴 Red keypoints and connections for incorrect posture

🟢 Green keypoints for correct posture

Using Three.js to add visual indicators like text, arrows, labels near the problematic joints explaining the issue.

📱 Mobile-Responsive Design
The app must work on mobile browsers, with webcam access and responsive layout.


Live link of the website : https://ranjini07.netlify.app/

