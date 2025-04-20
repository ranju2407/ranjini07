export const calculateAngle = (a, b, c) => {
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const cb = { x: b.x - c.x, y: b.y - c.y };
    
    const dot = (ab.x * cb.x + ab.y * cb.y);
    const cross = (ab.x * cb.y - ab.y * cb.x);
    
    const alpha = Math.atan2(cross, dot);
    return Math.abs(alpha * 180 / Math.PI);
  };
  
  export const calculateSlope = (a, b) => {
    return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
  };
  
  export const getPhase = (exercise, landmarks) => {
    if (!landmarks || landmarks.length < 32) return 'unknown';
    
    if (exercise === 'squats') {
      const leftHip = landmarks[23];
      const leftKnee = landmarks[25];
      const leftAnkle = landmarks[27];
      
      const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      
      if (kneeAngle < 120) return 'bottom';
      const hipY = leftHip.y;
      const kneeY = leftKnee.y;
      
      return kneeY > hipY ? 'descent' : 'ascent';
    }
    else if (exercise === 'pushups') {
      const leftShoulder = landmarks[11];
      const leftElbow = landmarks[13];
      const leftWrist = landmarks[15];
      
      const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      const wristY = leftWrist.y;
      const shoulderY = leftShoulder.y;
      
      if (elbowAngle > 160) return 'top';
      return wristY < shoulderY ? 'descent' : 'ascent';
    }
    
    return 'unknown';
  };