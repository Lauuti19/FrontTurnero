import React, { useState, useEffect, useRef } from 'react';

const EmomTimer = () => {
  const [duration, setDuration] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [minuteMark, setMinuteMark] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRunning && seconds < duration * 60) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          if (next % 60 === 0) {
            setMinuteMark(m => m + 1);
            audioRef.current.play();
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, duration, seconds]);

  const toggle = () => {
    setSeconds(0);
    setMinuteMark(0);
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
        <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} placeholder="Duración (min)" />
      </div>
      <div className="timer-display">{format()}</div>
      <button className="timer-btn" onClick={toggle}>{isRunning ? 'Detener' : 'Iniciar'}</button>
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" preload="auto" />
    </div>
  );
};

export default EmomTimer;