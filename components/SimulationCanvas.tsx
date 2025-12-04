
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import SpacetimeMesh from './SpacetimeMesh';
import CelestialBody from './CelestialBody';
import { StellarStage, POS_EARTH, POS_EVOLVING, EARTH_VISUAL_MASS, EARTH_VISUAL_RADIUS } from '../constants';

interface SimulationCanvasProps {
  mass: number;
  radius: number;
  stage: StellarStage;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ mass, radius, stage }) => {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 10, 50]} fov={50} far={2000} />
      <OrbitControls 
        enablePan={true} 
        enableZoom={true}
        minDistance={1} 
        maxDistance={500} 
        autoRotate={true}
        autoRotateSpeed={0.3}
      />
      
      <color attach="background" args={['#000000']} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 20, 10]} intensity={1} />
      
      <Suspense fallback={null}>
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <group>
          {/* Dual Body Spacetime Mesh */}
          <SpacetimeMesh 
            mass1={EARTH_VISUAL_MASS} 
            pos1={POS_EARTH}
            mass2={mass} 
            pos2={POS_EVOLVING} 
          />

          {/* Static Body: Earth */}
          <group position={POS_EARTH}>
            <CelestialBody 
              mass={EARTH_VISUAL_MASS} 
              radius={EARTH_VISUAL_RADIUS} 
              stage={StellarStage.EARTH} 
            />
          </group>

          {/* Evolving Body: Sun -> Neutron -> Black Hole */}
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