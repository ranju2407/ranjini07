export const drawPose = (canvas, video, landmarks, feedback) => {
    if (!canvas || !video) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw landmarks
    if (landmarks && landmarks.length > 0) {
      // Draw connections
      drawConnections(ctx, landmarks, feedback);
      
      // Draw keypoints
      landmarks.forEach((landmark, i) => {
        if (landmark.score > 0.3) {
          const color = getKeypointColor(i, feedback);
          drawKeypoint(ctx, landmark, color);
        }
      });
    }
  };
  
  const drawKeypoint = (ctx, keypoint, color) => {
    const { x, y } = keypoint;
    
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  };
  
  const drawConnections = (ctx, landmarks, feedback) => {
    // Define pose connections (simplified)
    const connections = [
      // Shoulders to hips
      [11, 23], [12, 24],
      // Hips to knees
      [23, 25], [24, 26],
      // Knees to ankles
      [25, 27], [26, 28],
      // Shoulders to elbows
      [11, 13], [12, 14],
      // Elbows to wrists
      [13, 15], [14, 16]
    ];
    
    connections.forEach(([i, j]) => {
      const a = landmarks[i];
      const b = landmarks[j];
      
      if (a.score > 0.3 && b.score > 0.3) {
        const isProblematic = isConnectionProblematic(i, j, feedback);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = isProblematic ? 'red' : 'green';
        ctx.stroke();
      }
    });
  };
  
  const isConnectionProblematic = (i, j, feedback) => {
    if (!feedback || !feedback.issues) return false;
    
    return feedback.issues.some(issue => 
      issue.keypoints && 
      (issue.keypoints.includes(i) || issue.keypoints.includes(j))
    );
  };
  
  const getKeypointColor = (i, feedback) => {
    if (!feedback || !feedback.issues) return 'green';
    
    const isProblematic = feedback.issues.some(issue => 
      issue.keypoints && issue.keypoints.includes(i)
    );
    
    return isProblematic ? 'red' : 'green';
  };