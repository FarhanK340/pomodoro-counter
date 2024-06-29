import React, { useState, useEffect, useRef } from 'react'
import beep from './beep.mp3';

const App = () => {

  const [breakLength, setBreakLength] = useState(5);;
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const audioRef = useRef(null);


  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      audioRef.current.play();
      if (isSession) {
        setTimeLeft(breakLength * 60);
        setIsSession(false);
      } else {
        setTimeLeft(sessionLength * 60);
        setIsSession(true);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isSession, breakLength, sessionLength]);

  const increment = (e) => {
    if (e.currentTarget.id === 'break-increment') {
      setBreakLength((prev) => Math.min(prev + 1, 60));
    } else if (e.currentTarget.id === 'session-increment') {
      setSessionLength((prev) => Math.min(prev + 1, 60));
      if(isSession)setTimeLeft((prev) => Math.min((sessionLength + 1) * 60, 3600));
    }
  }

  const decrement = (e) => {
    if (e.currentTarget.id === 'break-decrement') {
      setBreakLength((prev) => Math.max(prev - 1, 1));
    }
    else if (e.currentTarget.id === 'session-decrement') {
      setSessionLength((prev) => Math.max(prev - 1, 1));
      if(isSession) setTimeLeft((prev) =>  Math.max((sessionLength - 1) * 60, 60));
    }
  }

  const reset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };


  return (
    <div className='bg-teal-800 h-screen flex flex-col justify-evenly items-center font-serif text-white'>
      <div className='space-y-5'>
        <h1 className='font-bold text-5xl mb-12'>Pomodoro Counter</h1>
        <div className='w-full flex justify-evenly space-x-5 text-3xl '>
          <div className=''>
            <div id='break-label' className='font-semibold'>Break Length</div>
            <div className='flex flex-row justify-center items-center space-x-2'>
              <div id='break-decrement' className='mt-2 hover:cursor-pointer' onClick={decrement}  >
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M561-240 320-481l241-241 43 43-198 198 198 198-43 43Z" /></svg>
              </div>
              <div id='break-length'>{breakLength}</div>
              <div id='break-increment' className='mt-2 hover:cursor-pointer' onClick={increment}>
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M530-481 332-679l43-43 241 241-241 241-43-43 198-198Z" /></svg>
              </div>
            </div>
          </div>
          <div>
            <div id='session-label' className='font-semibold'>Session Length</div>
            <div className='flex flex-row justify-center items-center space-x-2'>
              <div id='session-decrement' className='mt-2 hover:cursor-pointer' onClick={decrement}>
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M561-240 320-481l241-241 43 43-198 198 198 198-43 43Z" /></svg>
              </div>
              <div id='session-length'>{sessionLength}</div>
              <div id='session-increment' className='mt-2 hover:cursor-pointer' onClick={increment}>
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M530-481 332-679l43-43 241 241-241 241-43-43 198-198Z" /></svg>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col justify-center items-center text-6xl'>
          <div className='border-8 border-teal-950 rounded-[20px] p-10 flex flex-col justify-center items-center'>
            <div id='timer-label' className='font-semibold text-4xl underline mb-5'>{isSession? 'Session': 'Break' }</div>
            <time id='time-left' time='mm:ss'>{formatTime(timeLeft)}</time>
          </div>
        </div>
        <div className='w-full flex flex-row justify-center items-center text-2xl space-x-8'>
          <div id='start_stop' onClick={() => setIsRunning(!isRunning)} className='hover:cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" height="96px" viewBox="0 -960 960 960" width="96px" fill="#FFFFFF"><path d="M200-332v-296l220 148-220 148Zm340 12v-320h60v320h-60Zm160 0v-320h60v320h-60Z" /></svg>
          </div>
          <div id='reset' onClick={reset} className='hover:cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" height="64px" viewBox="0 -960 960 960" width="64px" fill="#FFFFFF"><path d="M451-122q-123-10-207-101t-84-216q0-77 35.5-145T295-695l43 43q-56 33-87 90.5T220-439q0 100 66 173t165 84v60Zm60 0v-60q100-12 165-84.5T741-439q0-109-75.5-184.5T481-699h-20l60 60-43 43-133-133 133-133 43 43-60 60h20q134 0 227 93.5T801-439q0 125-83.5 216T511-122Z" /></svg>
          </div>
        </div>
        <audio id="beep" ref={audioRef} src={beep} />
      </div>
    </div>
  )
}

export default App
