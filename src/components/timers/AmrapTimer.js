import React, { useState, useEffect, useRef } from 'react';

const AmrapTimer = () => {
  const [minutes, setMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft(prev => {
        if (prev === 1) audioRef.current.play();
        return prev - 1;
      }), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const toggle = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setSecondsLeft(minutes * 60);
      setIsRunning(true);
    }
  };

  const format = () => {
    const min = Math.floor(secondsLeft / 60);
    const sec = secondsLeft % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="timer-container">
      <div className="timer-controls">
        <input type="number" value={minutes} onChange={e => setMinutes(Number(e.target.value))} placeholder="Minutos" />
      </div>
      <div className="timer-display">Tiempo restante: {format()}</div>
      <button className="timer-btn" onClick={toggle}>{isRunning ? 'Detener' : 'Iniciar'}</button>
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" preload="auto" />
    </div>
  );
};

export default AmrapTimer;
