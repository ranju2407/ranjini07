import { useState, useRef } from 'react';
import ExerciseSelector from './components/ExerciseSelector';
import PoseCanvas from './components/PoseCanvas';
import PoseFeedback from './components/PoseFeedback';
import ThreeJSVisuals from './components/ThreeJSVisuals';
import './App.css';

function App() {
  const [exercise, setExercise] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [landmarks, setLandmarks] = useState(null);
  const canvasRef = useRef(null);

  return (
    <div className="app-container">
      <h1>🏋️ AI Fitness Evaluator</h1>
      <ExerciseSelector onSelect={setExercise} currentExercise={exercise} />
      
      <div className="detection-container">
        <PoseCanvas 
          exercise={exercise}
          onLandmarks={setLandmarks}
          onFeedback={setFeedback}
          canvasRef={canvasRef}
        />
        
        {landmarks && (
          <ThreeJSVisuals 
            landmarks={landmarks} 
            feedback={feedback} 
            canvasRef={canvasRef}
          />
        )}
      </div>
      
      <PoseFeedback feedback={feedback} exercise={exercise} />
    </div>
  );
}

export default App;
