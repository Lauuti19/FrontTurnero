import React, { useState } from 'react';
import TimerModeSelector from '../components/timers/TimerModeSelector';
import '../styles/TimerPage.css';

const TimerPage = () => {
  const [mode, setMode] = useState('');

  return (
    <div className="timer-page-container">
      <div className="timer-content">
      <h2>Selecciona un modo de temporizador</h2>
      <div className="timer-page-controls" style={{ justifyContent: 'center' }}>
        {['Tabata', 'AMRAP', 'ForTime', 'EMOM', 'OTM'].map(tipo => (
          <button
            key={tipo}
            onClick={() => setMode(tipo)}
            className="timer-btn"
          >
            {tipo}
          </button>
        ))}
      </div>
      <div className="timer-selected">
        <TimerModeSelector mode={mode} />
      </div>
      </div>
    </div>
  );
};

export default TimerPage;
