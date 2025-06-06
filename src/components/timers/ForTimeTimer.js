import React, { useState, useEffect, useRef } from 'react';

const ForTimeTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if ((prev + 1) % 60 === 0) audioRef.current.play();
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggle = () => {
    setIsRunning(prev => !prev);
  };

  const format = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="timer-container">
      <div className="timer-display">{format()}</div>
      <button className="timer-btn" onClick={toggle}>{isRunning ? 'Detener' : 'Iniciar'}</button>
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" preload="auto" />
    </div>
  );
};

export default ForTimeTimer;
