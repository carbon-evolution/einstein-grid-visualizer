import React, { useState, useEffect, useCallback, useRef } from 'react';
import SimulationCanvas from './components/SimulationCanvas';
import Overlay from './components/Overlay';
import { INITIAL_MASS, MAX_MASS, SIMULATION_SPEED, StellarStage } from './constants';
import { determineStage, calculateRadius } from './utils/physics';

const App: React.FC = () => {
  const [mass, setMass] = useState(INITIAL_MASS);
  const [isRunning, setIsRunning] = useState(false);
  
  // Derived state for the evolving body
  const stage = determineStage(mass);
  const radius = calculateRadius(mass, stage);
  
  const animationFrameRef = useRef<number>(0);

  const updateSimulation = useCallback(() => {
    setMass((prevMass) => {
      if (prevMass >= MAX_MASS) {
        setIsRunning(false);
        return MAX_MASS;
      }
      return prevMass + SIMULATION_SPEED;
    });
    
    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(updateSimulation);
    }
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(updateSimulation);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, updateSimulation]);

  const handleToggle = () => {
    // If finished, reset first
    if (mass >= MAX_MASS) {
      setMass(INITIAL_MASS);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setMass(INITIAL_MASS);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      <SimulationCanvas mass={mass} radius={radius} stage={stage} />
      <Overlay 
        mass={mass} 
        radius={radius} 
        stage={stage} 
        isRunning={isRunning} 
        onToggle={handleToggle}
        onReset={handleReset}
      />
    </div>
  );
};

export default App;