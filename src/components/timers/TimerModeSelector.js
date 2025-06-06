import React from 'react';
import TabataTimer from './TabataTimer';
import AmrapTimer from './AmrapTimer';
import ForTimeTimer from './ForTimeTimer';
import EmomTimer from './EmomTimer';
import OtmTimer from './OtmTimer';
import '../../styles/timers.css';
const TimerModeSelector = ({ mode }) => {
  const renderTimer = () => {
    switch (mode) {
      case 'Tabata':
        return <TabataTimer />;
      case 'AMRAP':
        return <AmrapTimer />;
      case 'ForTime':
        return <ForTimeTimer />;
      case 'EMOM':
        return <EmomTimer />;
      case 'OTM':
        return <OtmTimer />;
      default:
        return <div className="timer-box">
        <h2>Selecciona un Reloj para comenzar tu entrenamiento</h2>
      </div>;
    }
  };

  return (
    <div>
      <div className="timer-box">
        <h2>Modo: {mode || 'Ninguno'}</h2>
        {renderTimer()}
      </div>
    </div>
  );
};

export default TimerModeSelector;
