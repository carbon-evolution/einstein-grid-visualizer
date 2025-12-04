
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { STAGE_COLORS, StellarStage } from '../constants';

interface CelestialBodyProps {
  mass: number;
  radius: number;
  stage: StellarStage;
}

const CelestialBody: React.FC<CelestialBodyProps> = ({ mass, radius, stage }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Use pure black for black hole, otherwise the stage color
  const baseColor = stage === StellarStage.BLACK_HOLE ? '#000000' : STAGE_COLORS[stage];
  const targetColor = new THREE.Color(baseColor);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // @ts-ignore
      meshRef.current.material.color.lerp(targetColor, delta * 2);
      
      if (stage === StellarStage.BLACK_HOLE) {
        // Pure black matte
        // @ts-ignore
        meshRef.current.material.emissive.setHex(0x000000);
      } else {
        // Pulse effect for stars
        // @ts-ignore
        meshRef.current.material.emissive.lerp(targetColor, delta * 2);
        // @ts-ignore
        meshRef.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Main Body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial 
          color={baseColor}
          roughness={stage === StellarStage.BLACK_HOLE ? 0.0 : 0.4}
          metalness={stage === StellarStage.BLACK_HOLE ? 0.0 : 0.6}
          emissive={baseColor}
          emissiveIntensity={stage === StellarStage.BLACK_HOLE ? 0 : 0.5}
        />
      </mesh>

      {/* Black Hole Specific Visuals: Event Horizon / Photon Ring Glow */}
      {stage === StellarStage.BLACK_HOLE && (
        <>
          {/* Inner Void (Pure Black) */}
          <mesh scale={[0.98, 0.98, 0.98]}>
             <sphereGeometry args={[radius, 32, 32]} />
             <meshBasicMaterial color="#000000" />
          </mesh>

          {/* Photon Sphere / Accretion Glow Halo */}
          <mesh scale={[1.2, 1.2, 1.2]}>
            <sphereGeometry args={[radius, 64, 64]} />
            <meshBasicMaterial 
              color="#ff3300" 
              transparent 
              opacity={0.15} 
              side={THREE.BackSide} 
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Intense Rim */}
          <mesh scale={[1.05, 1.05, 1.05]}>
             <sphereGeometry args={[radius, 64, 64]} />
             <meshBasicMaterial 
               color="#ff8800" 
               transparent 
               opacity={0.3} 
               side={THREE.BackSide}
               blending={THREE.AdditiveBlending}
             />
          </mesh>
        </>
      )}
    </group>
  );
};

export default CelestialBody;