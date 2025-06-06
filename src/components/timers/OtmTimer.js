import React, { useState, useEffect, useRef } from 'react';

const OtmTimer = () => {
  const [duration, setDuration] = useState(10); 
  const [intervalo, setIntervalo] = useState(2); 
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval;

    if (isRunning && seconds < duration * 60) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          const next = prevSeconds + 1;

          
          if (next % (intervalo * 60) === 0 || next === 1) {
            audioRef.current?.play();
          }

          return next;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds, duration, intervalo]);

  const toggle = () => {
    if (!isRunning) {
      setSeconds(0); 
    }
    setIsRunning(prev => !prev);
  };

  const format = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="timer-container">
      <div className="timer-controls">
        <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} placeholder="Duración total (min)" />
        <input type="number" value={intervalo} onChange={e => setIntervalo(Number(e.target.value))} placeholder="Cada X min" />
      </div>
      <div className="timer-display">{format()}</div>
      <div>Intervalo cada {intervalo} min</div>
      <button className="timer-btn" onClick={toggle}>
        {isRunning ? 'Detener' : 'Iniciar'}
      </button>
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" preload="auto" />
    </div>
  );
};

export default OtmTimer;
