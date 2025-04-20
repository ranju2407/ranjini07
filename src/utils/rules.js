import { calculateAngle, calculateSlope, getPhase } from './poseCalculations';

export const analyzePose = (landmarks, exercise) => {
  if (!landmarks || landmarks.length < 32) return null;

  const phase = getPhase(exercise, landmarks);
  const issues = [];

  if (exercise === 'squats') {
    analyzeSquats(landmarks, phase, issues);
  } else if (exercise === 'pushups') {
    analyzePushups(landmarks, phase, issues);
  }

  return { phase, issues };
};

const analyzeSquats = (landmarks, phase, issues) => {
  // Get key landmarks
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];
  const leftAnkle = landmarks[27];
  const rightAnkle = landmarks[28];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];

  // Calculate angles
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const backAngle = calculateSlope(leftShoulder, leftHip);

  if (phase === 'descent' || phase === 'ascent') {
    // Check knee bend
    if (leftKneeAngle > 160 || rightKneeAngle > 160) {
      issues.push({
        message: 'Bend your knees more',
        keypoints: [25, 26] // knee indices
      });
    }

    // Check back angle
    if (Math.abs(backAngle) > 20) {
      issues.push({
        message: 'Keep your back more upright',
        keypoints: [11, 12, 23, 24] // shoulder and hip indices
      });
    }
  }
};

const analyzePushups = (landmarks, phase, issues) => {
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftElbow = landmarks[13];
  const rightElbow = landmarks[14];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  // Calculate angles
  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const backSlope = calculateSlope(leftShoulder, leftHip);

  if (phase === 'descent') {
    // Check if chest is low enough
    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipY = (leftHip.y + rightHip.y) / 2;
    const descentDepth = shoulderY - hipY;
    
    if (descentDepth < 0.1) {
      issues.push({
        message: 'Lower your chest closer to the ground',
        keypoints: [11, 12, 23, 24]
      });
    }

    // Check elbow angle
    if (leftElbowAngle < 90 || rightElbowAngle < 90) {
      issues.push({
        message: 'Keep elbows at 90 degree angle',
        keypoints: [13, 14]
      });
    }
  }

  // Check back alignment
  if (Math.abs(backSlope) > 10) {
    issues.push({
      message: 'Keep your back straight',
      keypoints: [11, 12, 23, 24]
    });
  }
};