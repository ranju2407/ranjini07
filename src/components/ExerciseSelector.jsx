
import './ExerciseSelector.css';

const ExerciseSelector = ({ onSelect, currentExercise }) => {
  return (
    <div className="exercise-selector">
      <button
        className={`exercise-btn ${currentExercise === 'squats' ? 'active stop-btn' : ''}`}
        onClick={() => currentExercise === 'squats' ? onSelect(null) : onSelect('squats')}
      >
        {currentExercise === 'squats' ? 'Stop Squats' : 'Start Squats'}
      </button>
      <button
        className={`exercise-btn ${currentExercise === 'pushups' ? 'active stop-btn' : ''}`}
        onClick={() => currentExercise === 'pushups' ? onSelect(null) : onSelect('pushups')}
      >
        {currentExercise === 'pushups' ? 'Stop Push-Ups' : 'Start Push-Ups'}
      </button>
    </div>
  );
};

export default ExerciseSelector;