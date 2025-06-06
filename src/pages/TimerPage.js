import React, { useState } from 'react';
import TimerModeSelector from '../components/timers/TimerModeSelector';

const TimerPage = () => {
  const [mode, setMode] = useState('');

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '1rem' }}>Selecciona un modo de temporizador</h2>
      <div className="timer-controls" style={{ justifyContent: 'center' }}>
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
      <TimerModeSelector mode={mode} />
    </div>
  );
};

export default TimerPage;
