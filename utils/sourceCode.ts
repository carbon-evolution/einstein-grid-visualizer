
export const PROJECT_FILES = {
  'package.json': `{
  "name": "einstein-grid-visualizer",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.12",
    "@react-three/drei": "^9.96.1",
    "lucide-react": "^0.303.0",
    "jszip": "^3.10.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/three": "^0.160.0",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}`,
  'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`,
  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
  'tsconfig.node.json': `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,
  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Einstein Grid Visualizer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { margin: 0; padding: 0; background: #000; color: white; overflow: hidden; }
      #root { width: 100vw; height: 100vh; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,
  'LICENSE': `MIT License

Copyright (c) 2024 Einstein Grid Visualizer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
  'README.md': `# 🌌 Einstein Grid Visualizer

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Built With](https://img.shields.io/badge/Built%20With-Google%20AI%20Studio-4285F4?logo=google)
![React](https://img.shields.io/badge/React-18-blue)
![Three.js](https://img.shields.io/badge/Three.js-Fiber-black)

A high-fidelity, interactive 3D simulation visualizing the warping of spacetime caused by celestial bodies of varying masses, based on General Relativity concepts.

> **Designed and Generated using [Google AI Studio](https://aistudio.google.com/)**

![Application Demo](https://via.placeholder.com/800x400/001966/00ccff?text=Einstein+Grid+Visualizer+Demo)
*(Replace with actual screenshot of the application)*

## 🧠 Scientific Concepts

This application visualizes gravity not as a force, but as geometric curvature in a 4-dimensional fabric (spacetime), projected here as a **3D Volumetric Lattice**.

### 1. General Relativity & Embedding Diagrams
The grid represents an "Embedding Diagram". In flat space (far from mass), the grid lines are straight and equidistant. As mass increases, it distorts the metric tensor, causing the grid lines to curve inward.
*   **Earth**: Creates a gentle, localized dip.
*   **Sun**: Creates a wider, deeper gravity well.
*   **Black Hole**: Creates an asymptotic "throat" where grid lines are pulled infinitely inward.

### 2. Stellar Evolution & Limits
The simulation evolves a star through critical physics thresholds:

*   **Chandrasekhar Limit ($1.4 M_\\odot$)**: The maximum mass of a stable White Dwarf. Beyond this, electron degeneracy pressure fails, and the star collapses into a Neutron Star.
*   **Tolman-Oppenheimer-Volkoff (TOV) Limit (~$2.8 M_\\odot$)**: The maximum mass of a Neutron Star. Beyond this, neutron degeneracy pressure fails, and the object collapses completely into a **Black Hole**.

![Stellar Evolution](https://via.placeholder.com/800x200/000000/ffffff?text=Sun+%E2%86%92+Neutron+Star+%E2%86%92+Black+Hole)

### 3. The Visual Logic
*   **Spacetime Grid**: Rendered using a Lorentzian warping function ($1/\\sqrt{r^2 + \\epsilon^2}$) to simulate the "draping" effect of gravity.
*   **Stress Tensor Colors**:
    *   🔵 **Blue/Cyan**: Low to Medium curvature (Safe zone).
    *   🟠 **Orange**: High curvature (Neutron Star surface gravity).
    *   🔴 **Red**: Extreme curvature (Event Horizon proximity).

## 🚀 Features

*   **Dual-Body Comparison**: Side-by-side visualization of Earth (static) vs. Evolving Stars.
*   **Volumetric 3D Grid**: A "ScienceClic" style lattice with high-resolution subdivision.
*   **Event Horizon Rendering**: Visualizes the Photon Sphere and Accretion glow for Black Holes.
*   **Interactive Controls**: Play, Pause, Reset, and Full 3D Camera Orbit/Zoom.

## 🛠️ Installation & Usage

This project is a modern web application built with **Vite, React, and Three.js (Fiber)**.

### 1. Prerequisites
Ensure you have **Node.js** (v16+) installed on your machine.

### 2. Setup
\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/einstein-grid-visualizer.git

# Navigate to directory
cd einstein-grid-visualizer

# Install dependencies
npm install
\`\`\`

### 3. Run Locally
\`\`\`bash
npm run dev
\`\`\`
Open your browser at \`http://localhost:5173\`.

## 📸 Screenshots

| Earth Curvature | Black Hole Singularity |
|:---:|:---:|
| ![Earth](https://via.placeholder.com/400x250/003300/ffffff?text=Earth+Gravity) | ![Black Hole](https://via.placeholder.com/400x250/000000/ff3300?text=Event+Horizon) |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
`
};

// We include the full source code here so the downloaded zip is complete.
export const APP_SOURCE = {
  'src/App.tsx': `import React, { useState, useEffect, useCallback, useRef } from 'react';
import SimulationCanvas from './components/SimulationCanvas';
import Overlay from './components/Overlay';
import { INITIAL_MASS, MAX_MASS, SIMULATION_SPEED, StellarStage } from './constants';
import { determineStage, calculateRadius } from './utils/physics';

const App: React.FC = () => {
  const [mass, setMass] = useState(INITIAL_MASS);
  const [isRunning, setIsRunning] = useState(false);
  
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

export default App;`,
'src/constants.ts': `export const G = 0.4;
export const C = 1;
export const INITIAL_MASS = 1.0;
export const MAX_MASS = 8.0;
export const CHANDRASEKHAR_LIMIT = 1.4;
export const TOV_LIMIT = 2.8;
export const GRID_SIZE = 40;
export const GRID_SEGMENTS = 200;
export const SIMULATION_SPEED = 0.001;
export const POS_EARTH = [-8, 0, 0] as [number, number, number];
export const POS_EVOLVING = [8, 0, 0] as [number, number, number];
export const EARTH_VISUAL_MASS = 0.15;
export const EARTH_VISUAL_RADIUS = 0.8;

export enum StellarStage {
  EARTH = 'Earth',
  SUN = 'Main Sequence Star',
  WHITE_DWARF = 'White Dwarf',
  NEUTRON_STAR = 'Neutron Star',
  BLACK_HOLE = 'Black Hole'
}

export const STAGE_COLORS = {
  [StellarStage.EARTH]: '#006400',
  [StellarStage.SUN]: '#FDB813',
  [StellarStage.WHITE_DWARF]: '#AACCFF',
  [StellarStage.NEUTRON_STAR]: '#00FFFF',
  [StellarStage.BLACK_HOLE]: '#FF3300'
};`,
'src/types.ts': `import { StellarStage } from './constants';

export interface SimulationState {
  mass: number;
  radius: number;
  stage: StellarStage;
  isRunning: boolean;
  schwarzschildRadius: number;
}

export interface Uniforms {
  uTime: { value: number };
  uMass: { value: number };
  uRadius: { value: number };
  uColor: { value: [number, number, number] };
  uGridColor: { value: [number, number, number] };
}`,
'src/utils/physics.ts': `import { StellarStage, CHANDRASEKHAR_LIMIT, TOV_LIMIT, G, C, EARTH_VISUAL_RADIUS } from '../constants';

export const calculateSchwarzschildRadius = (mass: number): number => {
  return (2 * G * mass) / (C * C);
};

export const determineStage = (mass: number): StellarStage => {
  if (mass < 0.5) return StellarStage.EARTH; 
  if (mass < CHANDRASEKHAR_LIMIT) return StellarStage.SUN;
  if (mass < TOV_LIMIT) return StellarStage.NEUTRON_STAR;
  return StellarStage.BLACK_HOLE;
};

export const calculateRadius = (mass: number, stage: StellarStage): number => {
  const rs = calculateSchwarzschildRadius(mass);

  switch (stage) {
    case StellarStage.EARTH:
      return EARTH_VISUAL_RADIUS;
    case StellarStage.SUN:
      return Math.max(1.8, 2.8 - (mass - 1.0) * 1.5); 
    case StellarStage.WHITE_DWARF:
      return 1.2;
    case StellarStage.NEUTRON_STAR:
      return 0.7;
    case StellarStage.BLACK_HOLE:
      return rs; 
    default:
      return 3.0;
  }
};`,
'src/components/CelestialBody.tsx': `import React, { useRef } from 'react';
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
  const baseColor = stage === StellarStage.BLACK_HOLE ? '#000000' : STAGE_COLORS[stage];
  const targetColor = new THREE.Color(baseColor);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // @ts-ignore
      meshRef.current.material.color.lerp(targetColor, delta * 2);
      
      if (stage === StellarStage.BLACK_HOLE) {
        // @ts-ignore
        meshRef.current.material.emissive.setHex(0x000000);
      } else {
        // @ts-ignore
        meshRef.current.material.emissive.lerp(targetColor, delta * 2);
        // @ts-ignore
        meshRef.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
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
      {stage === StellarStage.BLACK_HOLE && (
        <>
          <mesh scale={[0.98, 0.98, 0.98]}>
             <sphereGeometry args={[radius, 32, 32]} />
             <meshBasicMaterial color="#000000" />
          </mesh>
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
export default CelestialBody;`,
'src/components/SimulationCanvas.tsx': `import React, { Suspense } from 'react';
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
          <SpacetimeMesh 
            mass1={EARTH_VISUAL_MASS} 
            pos1={POS_EARTH}
            mass2={mass} 
            pos2={POS_EVOLVING} 
          />
          <group position={POS_EARTH}>
            <CelestialBody 
              mass={EARTH_VISUAL_MASS} 
              radius={EARTH_VISUAL_RADIUS} 
              stage={StellarStage.EARTH} 
            />
          </group>
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
export default SimulationCanvas;`,
'src/components/SpacetimeMesh.tsx': `import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHANDRASEKHAR_LIMIT, TOV_LIMIT } from '../constants';

const vertexShader = \`
uniform float uMass1;
uniform vec3 uPos1;
uniform float uMass2;
uniform vec3 uPos2;
uniform float uTime;

varying float vDistortion;
varying vec3 vPos;
varying float vDistance;

float getDisplacement(float mass, float dist) {
    float epsilon = 1.2; 
    float curve = 1.0 / sqrt(dist*dist + epsilon*epsilon);
    float strength = mass * 12.0; 
    return strength * curve;
}

void main() {
  vec3 pos = position;
  
  vec3 dir1 = pos - uPos1;
  float dist1 = length(dir1);
  float disp1 = (uMass1 * 5.0) / (dist1*dist1 + 2.0); 
  
  vec3 dir2 = pos - uPos2;
  float dist2 = length(dir2);
  float factor2 = getDisplacement(uMass2, dist2);
  float limit = 0.95; 
  float disp2 = min(factor2, limit);

  vec3 finalPos = pos;
  
  if (dist1 > 0.1) {
     finalPos += (uPos1 - finalPos) * disp1 * 0.15;
  }
  
  if (dist2 > 0.1) {
     finalPos += (uPos2 - finalPos) * disp2;
  }

  vPos = finalPos;
  vDistortion = disp2; 
  vDistance = length(finalPos);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
}
\`;

const fragmentShader = \`
uniform float uOpacity;
varying float vDistortion;
varying vec3 vPos;
varying float vDistance;

void main() {
  vec3 colorBlue   = vec3(0.0, 0.1, 0.4);
  vec3 colorCyan   = vec3(0.0, 0.8, 1.0);
  vec3 colorOrange = vec3(1.0, 0.5, 0.0);
  vec3 colorRed    = vec3(1.0, 0.0, 0.0);
  
  vec3 finalColor;
  float t = clamp(vDistortion, 0.0, 1.0);

  if (t < 0.15) {
      finalColor = mix(colorBlue, colorCyan, t / 0.15);
  } else if (t < 0.5) {
      finalColor = mix(colorCyan, colorOrange, (t - 0.15) / 0.35);
  } else {
      finalColor = mix(colorOrange, colorRed, (t - 0.5) / 0.45);
  }

  float alpha = uOpacity;
  alpha *= 1.0 - smoothstep(25.0, 40.0, vDistance);
  float tensionGlow = 0.5 + vDistortion * 0.5;
  gl_FragColor = vec4(finalColor, alpha * tensionGlow);
}
\`;

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
    const size = 28;
    const steps = 1.5; 
    const subDivisions = 80;

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
      
      let visualMass = mass2;
      
      if (mass2 <= CHANDRASEKHAR_LIMIT) {
        visualMass = mass2;
      } else if (mass2 <= TOV_LIMIT) {
        const multiplier = 2.5; 
        visualMass = CHANDRASEKHAR_LIMIT + (mass2 - CHANDRASEKHAR_LIMIT) * multiplier;
      } else {
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
export default SpacetimeMesh;`,
'src/components/Overlay.tsx': `import React, { useState } from 'react';
import { StellarStage, INITIAL_MASS, MAX_MASS, CHANDRASEKHAR_LIMIT, TOV_LIMIT, STAGE_COLORS } from '../constants';
import { Play, Pause, RefreshCw, Download, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { PROJECT_FILES, APP_SOURCE } from '../utils/sourceCode';

interface OverlayProps {
  mass: number;
  radius: number;
  stage: StellarStage;
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
}

const LegendItem = ({ color, label, isActive }: { color: string, label: string, isActive: boolean }) => (
  <div className={\`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 \${isActive ? 'bg-white/10 border border-white/20 translate-x-2 shadow-lg shadow-black/50' : 'opacity-40 hover:opacity-70'}\`}>
    <div 
      className={\`w-3 h-3 rounded-full \${isActive ? 'ring-2 ring-white/50 scale-125' : ''}\`} 
      style={{ backgroundColor: color, boxShadow: \`0 0 10px \${color}\` }}
    ></div>
    <span className={\`text-xs font-bold uppercase tracking-wider \${isActive ? 'text-white' : 'text-gray-400'}\`}>
      {label}
    </span>
  </div>
);

const Overlay: React.FC<OverlayProps> = ({ mass, radius, stage, isRunning, onToggle, onReset }) => {
  const [isZipping, setIsZipping] = useState(false);
  const massProgress = ((mass - INITIAL_MASS) / (MAX_MASS - INITIAL_MASS)) * 100;

  const handleDownload = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      Object.entries(PROJECT_FILES).forEach(([path, content]) => {
        zip.file(path, content);
      });
      Object.entries(APP_SOURCE).forEach(([path, content]) => {
        zip.file(path, content);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'antigravity-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to zip", e);
      alert("Failed to generate zip file.");
    } finally {
      setIsZipping(false);
    }
  };
  
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-6 flex flex-col justify-between z-10">
      <div className="flex flex-col gap-6 pointer-events-auto items-start">
        <div>
          <h1 className="text-4xl md:text-5xl font-black italic bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
            GRAVITY COMPARISON
          </h1>
          <p className="text-blue-200/60 text-xs font-mono mt-1 ml-1 uppercase tracking-[0.2em]">
            Earth vs. Stellar Evolution
          </p>
        </div>
        <div className="bg-black/80 backdrop-blur-xl p-4 rounded-xl border border-white/10 min-w-[200px]">
           <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
             Bodies
           </h3>
           <div className="space-y-1">
             <LegendItem color={STAGE_COLORS[StellarStage.EARTH]} label="Earth (Static)" isActive={true} />
             <div className="h-px bg-white/10 my-2" />
             <LegendItem color={STAGE_COLORS[StellarStage.SUN]} label="Sun" isActive={stage === StellarStage.SUN} />
             <LegendItem color={STAGE_COLORS[StellarStage.NEUTRON_STAR]} label="Neutron Star" isActive={stage === StellarStage.NEUTRON_STAR} />
             <LegendItem color={STAGE_COLORS[StellarStage.BLACK_HOLE]} label="Black Hole" isActive={stage === StellarStage.BLACK_HOLE} />
           </div>
        </div>
      </div>
      <div className="absolute top-6 right-6 pointer-events-auto bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 hidden md:block">
        <h3 className="text-lg font-mono font-bold text-gray-200 mb-2">Einstein Field Equation</h3>
        <div className="text-xl font-serif text-yellow-400 mb-4">
          G<sub>μν</sub> + Λg<sub>μν</sub> = κT<sub>μν</sub>
        </div>
        <div className="space-y-2 text-sm font-mono text-gray-300">
          <div className="flex justify-between items-center gap-8">
            <span className="text-gray-500">Evolving Body</span>
            <span className={\`font-bold \${stage === StellarStage.BLACK_HOLE ? 'text-red-500 animate-pulse' : 'text-blue-400'}\`}>
              {stage}
            </span>
          </div>
          <div className="h-px bg-white/10 my-2" />
          <div className="flex justify-between items-center gap-4">
             <span className="text-gray-500">Chandrasekhar Limit</span>
             <span className="text-orange-400 font-bold">{CHANDRASEKHAR_LIMIT} M<sub>⊙</sub></span>
          </div>
          <div className="flex justify-between items-center gap-4">
             <span className="text-gray-500">TOV Limit</span>
             <span className="text-red-400 font-bold">~{TOV_LIMIT} M<sub>⊙</sub></span>
          </div>
        </div>
      </div>
      <div className="absolute right-6 bottom-32 pointer-events-auto flex items-center gap-3">
        <div className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] rotate-180" style={{ writingMode: 'vertical-rl' }}>
          Curvature Intensity
        </div>
        <div className="bg-black/80 backdrop-blur-md p-2 rounded-2xl border border-white/10 flex flex-col items-center gap-2 shadow-2xl">
          <span className="text-[8px] font-bold text-red-500">MAX</span>
          <div className="w-3 h-40 rounded-full border border-white/20 relative overflow-hidden ring-1 ring-white/5">
             <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #001966 0%, #00ccff 30%, #ff8000 70%, #ff0000 100%)' }} />
          </div>
          <span className="text-[8px] font-bold text-blue-500">MIN</span>
        </div>
      </div>
      <div className="w-full max-w-lg pointer-events-auto bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10 self-center mb-8 shadow-2xl shadow-black/50">
         <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Mass (Right)</span>
              <span className="font-mono text-lg font-bold text-white">{mass.toFixed(2)} M<sub>⊙</sub></span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-500 h-full transition-all duration-75 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: \`\${massProgress}%\` }} />
            </div>
          </div>
          <div>
             <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Radius (Right)</span>
              <span className="font-mono text-lg font-bold text-white">{radius.toFixed(2)} u</span>
            </div>
             <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-purple-500 h-full transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: \`\${(radius / 5) * 100}%\` }} />
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-8 justify-center">
          <button onClick={onToggle} className={\`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 \${isRunning ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' : 'bg-white text-black hover:bg-gray-200'}\`}>
            {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            {isRunning ? 'PAUSE' : 'SIMULATE'}
          </button>
          <button onClick={onReset} className="flex items-center gap-2 px-6 py-3 bg-transparent text-gray-400 border border-gray-700 rounded-full font-bold hover:bg-gray-800 hover:text-white transition-colors">
            <RefreshCw size={18} />
            RESET
          </button>
          <button onClick={handleDownload} disabled={isZipping} className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-blue-400 border border-gray-700 rounded-full font-bold hover:bg-gray-700 hover:text-blue-300 transition-colors disabled:opacity-50" title="Download Source Code (ZIP)">
            {isZipping ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Overlay;`
};
