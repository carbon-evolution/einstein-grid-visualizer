import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHANDRASEKHAR_LIMIT, TOV_LIMIT, ORBIT_RADIUS, ORBIT_SPEED } from '../constants';

const vertexShader = `
uniform float uMass1;
uniform vec3 uPos1;
uniform float uMass2;
uniform vec3 uPos2;
uniform float uTime;
uniform float uConcentration;

varying float vDistortion;
varying vec3 vPos;
varying float vDistance;

float getDisplacement(float mass, float dist) {
    float epsilon = 2.0 / (uConcentration + 0.5); 
    float curve = 1.0 / sqrt(dist*dist + epsilon*epsilon);
    float strength = mass * (8.0 + uConcentration * 2.0); 
    return strength * curve;
}

void main() {
  vec3 pos = position;
  
  // --- BODY 1: EARTH (Orbiting) ---
  vec3 dir1 = pos - uPos1;
  float dist1 = length(dir1);
  float disp1 = (uMass1 * 3.0) / (dist1*dist1 + 1.5); 
  
  // --- BODY 2: EVOLVING (Center) ---
  vec3 dir2 = pos - uPos2;
  float dist2 = length(dir2);
  
  float factor2 = getDisplacement(uMass2, dist2);
  float limit = 0.98; 
  float disp2 = min(factor2, limit);

  vec3 finalPos = pos;
  
  // Earth Pull
  if (dist1 > 0.1) {
     finalPos += (uPos1 - finalPos) * disp1 * 0.1; 
  }
  
  // Evolving Body Pull
  if (dist2 > 0.1) {
     finalPos += (uPos2 - finalPos) * disp2;
  }

  vPos = finalPos;
  
  // Distortion for color (mostly tracking central body for drama)
  vDistortion = disp2 + disp1 * 0.2; 
  
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
  vec3 colorSafe    = vec3(0.0, 0.2, 0.4);
  vec3 colorGentle  = vec3(0.0, 0.8, 1.0);
  vec3 colorIntense = vec3(1.0, 0.6, 0.0);
  vec3 colorExtreme = vec3(1.0, 0.0, 0.0);
  
  vec3 finalColor;
  float t = clamp(vDistortion, 0.0, 1.0);

  if (t < 0.1) {
      finalColor = mix(colorSafe, colorGentle, t * 10.0);
  } else if (t < 0.4) {
      finalColor = mix(colorGentle, colorIntense, (t - 0.1) / 0.3);
  } else {
      finalColor = mix(colorIntense, colorExtreme, (t - 0.4) / 0.6);
  }

  float alpha = uOpacity;
  alpha *= 1.0 - smoothstep(30.0, 50.0, vDistance);
  float glow = 0.4 + vDistortion * 0.8;
  
  gl_FragColor = vec4(finalColor, alpha * glow);
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
    const size = 30;
    const steps = 1.5; 
    const subDivisions = 64; 

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

    for (let y = -size; y <= size; y += steps) {
      for (let z = -size; z <= size; z += steps) {
        addLine(new THREE.Vector3(-size, y, z), new THREE.Vector3(size, y, z));
      }
    }
    for (let x = -size; x <= size; x += steps) {
      for (let z = -size; z <= size; z += steps) {
        addLine(new THREE.Vector3(x, -size, z), new THREE.Vector3(x, size, z));
      }
    }
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
      uConcentration: { value: 1.0 },
      uOpacity: { value: 0.4 },
    }),
    [mass1, mass2, pos1, pos2]
  );

  useFrame((state) => {
    if (meshRef.current) {
      // @ts-ignore
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      // @ts-ignore
      meshRef.current.material.uniforms.uMass1.value = mass1;
      
      // Update Earth Orbit Position for the Grid Shader
      const t = state.clock.getElapsedTime();
      const angle = t * ORBIT_SPEED;
      // @ts-ignore
      meshRef.current.material.uniforms.uPos1.value.set(
        Math.cos(angle) * ORBIT_RADIUS,
        0,
        Math.sin(angle) * ORBIT_RADIUS
      );
      
      let visualMass = mass2;
      let concentration = 1.0;

      if (mass2 <= CHANDRASEKHAR_LIMIT) {
        visualMass = mass2;
        concentration = 0.5 + (mass2 - 1.0) * 0.5; 
      } else if (mass2 <= TOV_LIMIT) {
        const nsProgress = (mass2 - CHANDRASEKHAR_LIMIT) / (TOV_LIMIT - CHANDRASEKHAR_LIMIT);
        visualMass = 2.0 + nsProgress * 4.0; 
        concentration = 1.5 + nsProgress * 1.5;
      } else {
        const bhProgress = (mass2 - TOV_LIMIT) / 2.0; 
        visualMass = 6.0 + bhProgress * 10.0;
        concentration = 4.0 + bhProgress * 2.0; 
      }

      // @ts-ignore
      meshRef.current.material.uniforms.uMass2.value = visualMass;
      // @ts-ignore
      meshRef.current.material.uniforms.uConcentration.value = concentration;
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