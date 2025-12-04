import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHANDRASEKHAR_LIMIT, TOV_LIMIT } from '../constants';

const vertexShader = `
uniform float uMass1;
uniform vec3 uPos1;
uniform float uMass2;
uniform vec3 uPos2;
uniform float uTime;

varying float vDistortion;
varying vec3 vPos;
varying float vDistance;

// "ScienceClic" Style Lorentzian Gravity Well
// Smooth, asymptotic funnel that looks physically authentic
float getDisplacement(float mass, float dist) {
    // Softening parameter to prevent infinity at r=0
    // This creates the "throat" look without breaking the vertex shader.
    // A value around 1.0 - 1.5 gives a nice deep well without artifacts.
    float epsilon = 1.2; 
    
    // Lorentzian-like curve: 1 / sqrt(r^2 + e^2)
    // This is smoother than 1/r and mimics embedding diagrams better.
    float curve = 1.0 / sqrt(dist*dist + epsilon*epsilon);
    
    // Strength multiplier
    float strength = mass * 12.0; 
    
    return strength * curve;
}

void main() {
  vec3 pos = position;
  
  // --- BODY 1: EARTH (Left) ---
  vec3 dir1 = pos - uPos1;
  float dist1 = length(dir1);
  // Earth is small, use sharper falloff for local dip
  float disp1 = (uMass1 * 5.0) / (dist1*dist1 + 2.0); 
  
  // --- BODY 2: EVOLVING (Right) ---
  vec3 dir2 = pos - uPos2;
  float dist2 = length(dir2);
  
  // Calculate main gravity well displacement
  float factor2 = getDisplacement(uMass2, dist2);
  
  // Limit displacement to avoid vertices crossing each other inside the body
  // (The "Clamping" effect for the singularity)
  float limit = 0.95; 
  float disp2 = min(factor2, limit);

  // Apply displacements
  vec3 finalPos = pos;
  
  // Earth Pull
  if (dist1 > 0.1) {
     finalPos += (uPos1 - finalPos) * disp1 * 0.15; // Gentle pull for Earth
  }
  
  // Evolving Body Pull
  if (dist2 > 0.1) {
     // We pull the grid vertices towards the center of mass
     finalPos += (uPos2 - finalPos) * disp2;
  }

  vPos = finalPos;
  
  // Calculate distortion intensity for fragment shader
  // We want the red color to appear only deep in the well
  vDistortion = disp2; 
  
  vDistance = length(finalPos);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
}
`;

const fragmentShader = `
uniform float uOpacity;
varying float vDistortion;
varying vec3 vPos;
varying float vDistance;

void main() {
  // MATCHING INTENSITY BAR: Blue -> Cyan -> Orange -> Red

  vec3 colorBlue   = vec3(0.0, 0.1, 0.4); // Deep Blue
  vec3 colorCyan   = vec3(0.0, 0.8, 1.0); // Cyan
  vec3 colorOrange = vec3(1.0, 0.5, 0.0); // Orange
  vec3 colorRed    = vec3(1.0, 0.0, 0.0); // Red
  
  vec3 finalColor;
  
  // vDistortion is clamped at ~0.95 max in vertex shader
  // We map this range strictly to our gradient to avoid white hotspots
  
  float t = clamp(vDistortion, 0.0, 1.0);

  if (t < 0.15) {
      // 0.0 to 0.15: Deep Blue -> Cyan
      // Flat space to mild gravity
      finalColor = mix(colorBlue, colorCyan, t / 0.15);
  } else if (t < 0.5) {
      // 0.15 to 0.5: Cyan -> Orange
      // Significant gravity (Sun/Neutron Star)
      finalColor = mix(colorCyan, colorOrange, (t - 0.15) / 0.35);
  } else {
      // 0.5 to 1.0: Orange -> Red
      // Extreme Gravity (Black Hole/Event Horizon)
      finalColor = mix(colorOrange, colorRed, (t - 0.5) / 0.45);
  }

  // Alpha logic
  float alpha = uOpacity;
  
  // Distance fade (World edges)
  alpha *= 1.0 - smoothstep(25.0, 40.0, vDistance);
  
  // Glow logic
  // We increase alpha slightly with distortion to make the core visible,
  // but we DO NOT multiply the RGB color values excessively to prevent whiteout.
  float tensionGlow = 0.5 + vDistortion * 0.5;
  
  gl_FragColor = vec4(finalColor, alpha * tensionGlow);
}
`;

interface SpacetimeMeshProps {
  mass1: number;
  pos1: [number, number, number];
  mass2: number;
  pos2: [number, number, number];
}

const SpacetimeMesh: React.FC<SpacetimeMeshProps> = ({ mass1, pos1, mass2, pos2 }) => {
  const meshRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const points: number[] = [];
    const size = 28; // Large coverage
    const steps = 1.5; 
    const subDivisions = 80; // HIGH RESOLUTION for smooth "Video Style" curves

    const addLine = (start: THREE.Vector3, end: THREE.Vector3) => {
      const vec = new THREE.Vector3().subVectors(end, start);
      for (let i = 0; i < subDivisions; i++) {
        const t1 = i / subDivisions;
        const t2 = (i + 1) / subDivisions;
        const p1 = new THREE.Vector3().copy(start).addScaledVector(vec, t1);
        const p2 = new THREE.Vector3().copy(start).addScaledVector(vec, t2);
        points.push(p1.x, p1.y, p1.z);
        points.push(p2.x, p2.y, p2.z);
      }
    };

    // Generate Volumetric Lattice
    // Y-Axis Layers
    for (let y = -size; y <= size; y += steps) {
      for (let z = -size; z <= size; z += steps) {
        addLine(new THREE.Vector3(-size, y, z), new THREE.Vector3(size, y, z));
      }
    }
    // Z-Axis Layers
    for (let x = -size; x <= size; x += steps) {
      for (let z = -size; z <= size; z += steps) {
        addLine(new THREE.Vector3(x, -size, z), new THREE.Vector3(x, size, z));
      }
    }
    // X-Axis Layers
    for (let x = -size; x <= size; x += steps) {
      for (let y = -size; y <= size; y += steps) {
        addLine(new THREE.Vector3(x, y, -size), new THREE.Vector3(x, y, size));
      }
    }

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return bufferGeometry;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMass1: { value: mass1 },
      uPos1: { value: new THREE.Vector3(...pos1) },
      uMass2: { value: mass2 },
      uPos2: { value: new THREE.Vector3(...pos2) },
      uOpacity: { value: 0.5 },
    }),
    [mass1, mass2, pos1, pos2]
  );

  useFrame((state) => {
    if (meshRef.current) {
      // @ts-ignore
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      // @ts-ignore
      meshRef.current.material.uniforms.uMass1.value = mass1;
      
      // LOGIC FOR VISUAL MASS INTENSITY
      // We map the physical mass to a "Visual Intensity Mass" to ensure
      // the grid deformations match the user's expectation of "Intense Bending".
      
      let visualMass = mass2;
      
      if (mass2 <= CHANDRASEKHAR_LIMIT) {
        // Sun Phase: Linear progression
        visualMass = mass2;
      } else if (mass2 <= TOV_LIMIT) {
        // Neutron Star Phase:
        // We boost this phase significantly to show the "snap" to high gravity
        const multiplier = 2.5; 
        visualMass = CHANDRASEKHAR_LIMIT + (mass2 - CHANDRASEKHAR_LIMIT) * multiplier;
      } else {
        // Black Hole Phase:
        // Extreme boost for the "Infinite Funnel" look
        const baseNS = CHANDRASEKHAR_LIMIT + (TOV_LIMIT - CHANDRASEKHAR_LIMIT) * 2.5;
        const multiplier = 5.0;
        visualMass = baseNS + (mass2 - TOV_LIMIT) * multiplier;
      }

      // @ts-ignore
      meshRef.current.material.uniforms.uMass2.value = visualMass;
    }
  });

  return (
    <lineSegments ref={meshRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        linewidth={1}
      />
    </lineSegments>
  );
};

export default SpacetimeMesh;