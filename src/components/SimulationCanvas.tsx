import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import SpacetimeMesh from './SpacetimeMesh';
import CelestialBody from './CelestialBody';
import { StellarStage, POS_EVOLVING, EARTH_VISUAL_MASS, EARTH_VISUAL_RADIUS, ORBIT_RADIUS, ORBIT_SPEED } from '../constants';
import * as THREE from 'three';

interface SimulationCanvasProps {
  mass: number;
  radius: number;
  stage: StellarStage;
}

// Helper component to handle Earth's orbit
const OrbitingEarth = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      const angle = t * ORBIT_SPEED;
      groupRef.current.position.x = Math.cos(angle) * ORBIT_RADIUS;
      groupRef.current.position.z = Math.sin(angle) * ORBIT_RADIUS;
    }
  });

  return (
    <group ref={groupRef}>
      <CelestialBody 
        mass={EARTH_VISUAL_MASS} 
        radius={EARTH_VISUAL_RADIUS} 
        stage={StellarStage.EARTH} 
      />
    </group>
  );
};

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ mass, radius, stage }) => {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 15, 40]} fov={50} far={2000} />
      <OrbitControls 
        enablePan={true} 
        enableZoom={true}
        minDistance={0.1} 
        maxDistance={500} 
        autoRotate={false}
      />
      
      <color attach="background" args={['#000000']} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 20, 10]} intensity={1} />
      
      <Suspense fallback={null}>
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <group>
          {/* Spacetime Mesh - Handles its own orbit calculations for the grid distortion */}
          <SpacetimeMesh 
            mass1={EARTH_VISUAL_MASS} 
            pos1={[ORBIT_RADIUS, 0, 0]} // Initial pos, updated in mesh useFrame
            mass2={mass} 
            pos2={POS_EVOLVING} 
          />

          {/* Orbiting Body: Earth */}
          <OrbitingEarth />

          {/* Central Body: Sun -> Neutron -> Black Hole */}
          <group position={POS_EVOLVING}>
            <CelestialBody 
              mass={mass} 
              radius={radius} 
              stage={stage} 
            />
          </group>
        </group>
      </Suspense>
    </Canvas>
  );
};

export default SimulationCanvas;