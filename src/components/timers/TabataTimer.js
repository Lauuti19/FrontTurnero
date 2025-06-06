import React, { useState, useEffect, useRef } from 'react';

const TabataTimer = () => {
  const [workTime, setWorkTime] = useState(20);
  const [restTime, setRestTime] = useState(10);
  const [rounds, setRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRunning && currentRound <= rounds) {
      if (secondsLeft > 0) {
        interval = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
      } else {
        audioRef.current.play();
        if (isWorkPhase) {
          setSecondsLeft(restTime);
          setIsWorkPhase(false);
        } else {
          if (currentRound < rounds) {
            setCurrentRound(prev => prev + 1);
            setSecondsLeft(workTime);
            setIsWorkPhase(true);
          } else {
            setIsRunning(false);
          }
        }
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, isWorkPhase, currentRound, rounds, workTime, restTime]);

  const toggle = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setCurrentRound(1);
      setIsWorkPhase(true);
      setSecondsLeft(workTime);
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
        <input type="number" value={workTime} onChange={e => setWorkTime(Number(e.target.value))} placeholder="Trabajo (s)" />
        <input type="number" value={restTime} onChange={e => setRestTime(Number(e.target.value))} placeholder="Descanso (s)" />
        <input type="number" value={rounds} onChange={e => setRounds(Number(e.target.value))} placeholder="Rondas" />
      </div>
      <div className="timer-display">
        Ronda {currentRound}/{rounds} - {isWorkPhase ? 'Trabajo' : 'Descanso'}: {format()}
      </div>
      <button className="timer-btn" onClick={toggle}>{isRunning ? 'Detener' : 'Iniciar'}</button>
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" preload="auto" />
    </div>
  );
};

export default TabataTimer;