"use client";

import { useState, useEffect, useRef } from 'react';

export default function Countdown() {
  const [time, setTime] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState('60');
  const [isMuted, setIsMuted] = useState(false);
  
  // Add refs for all sounds
  const startSoundRef = useRef<HTMLAudioElement | null>(null);
  const tickSoundRef = useRef<HTMLAudioElement | null>(null);
  const endSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize sounds - all using sound.mp3
  useEffect(() => {
    try {
      startSoundRef.current = new Audio('/sound.mp3');    
      tickSoundRef.current = new Audio('/sound.mp3');      
      endSoundRef.current = new Audio('/sound.mp3');  
      
      // Preload all sounds
      startSoundRef.current.load();
      tickSoundRef.current.load();
      endSoundRef.current.load();
      
      // Adjust volumes as needed
      if (tickSoundRef.current) {
        tickSoundRef.current.volume = 0.2;
      }
      
      console.log('Audio initialized successfully');
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  }, []);

  // Play sound function
  const playSound = (soundRef: React.RefObject<HTMLAudioElement>) => {
    if (!isMuted && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play()
        .catch(error => console.error('Sound playback failed:', error));
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    playSound(startSoundRef);
  };

  const pauseTimer = () => setIsRunning(false);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTime(parseInt(inputTime) || 60);
  };

  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputTime(value);
    if (!isRunning) {
      setTime(parseInt(value) || 0);
    }
  };

  const toggleSound = () => setIsMuted(!isMuted);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
        playSound(tickSoundRef);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      playSound(endSoundRef);
    }

    return () => clearInterval(interval);
  }, [isRunning, time, isMuted]);

  // Convert seconds to minutes and seconds display
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 m-4 w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Countdown Timer
        </h1>
        
        <div className="text-7xl font-bold text-center mb-8 text-gray-800">
          {timeDisplay}
        </div>

        <div className="w-full mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2 text-center">
            Set Timer (seconds):
          </label>
          <input
            type="number"
            value={inputTime}
            onChange={handleTimeInput}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
            placeholder="Enter seconds"
            min="1"
          />
        </div>

        <div className="flex space-x-4 justify-center mb-6">
          <button 
            onClick={isRunning ? pauseTimer : startTimer}
            className={`px-8 py-4 rounded-lg font-bold text-white transition-colors ${
              isRunning 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          
          <button 
            onClick={resetTimer}
            className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors"
          >
            Reset
          </button>

          <button
            onClick={toggleSound}
            className={`px-8 py-4 rounded-lg font-bold text-white transition-colors ${
              isMuted ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>

        {time === 0 && (
          <div className="text-xl text-center text-red-500 font-bold animate-pulse">
            Time&apos;s up
          </div>
        )}

        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => playSound(startSoundRef)}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
          >
            Test Start Sound
          </button>
          <button
            onClick={() => playSound(tickSoundRef)}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
          >
            Test Tick Sound
          </button>
          <button
            onClick={() => playSound(endSoundRef)}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
          >
            Test End Sound
          </button>
        </div>
      </div>
    </div>
  );
}