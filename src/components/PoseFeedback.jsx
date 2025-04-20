import './PoseFeedback.css';

const PoseFeedback = ({ feedback, exercise }) => {
  if (!feedback || !exercise) return null;

  return (
    <div className="feedback-container">
      <h3>{exercise === 'squats' ? 'Squats' : 'Push-Ups'} Feedback</h3>
      <div className="phase-info">
        <strong>Current Phase:</strong> {feedback.phase}
      </div>
      {feedback.issues.length > 0 ? (
        <ul className="issues-list">
          {feedback.issues.map((issue, index) => (
            <li key={index} className="issue-item">
              {issue.message}
            </li>
          ))}
        </ul>
      ) : (
        <div className="correct-pose">Good form! Keep it up!</div>
      )}
    </div>
  );
};

export default PoseFeedback;