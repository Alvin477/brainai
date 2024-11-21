import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Tubes } from './brain-tubes.tsx';
import { BrainParticles } from './brain-particles.tsx';
import { data } from './data';
import { AgeSimulation } from './AgeSimulation';
import {  useEffect, useRef } from 'react';
import { SpaceBackground } from './SpaceBackground';
import { useWebSocket } from './hooks/useWebSocket';
import { Diary } from './components/Diary';

function createBrainCurvesFromPaths(): THREE.CatmullRomCurve3[] {
  const paths = data.economics[0].paths;

  const brainCurves: THREE.CatmullRomCurve3[] = [];
  paths.forEach(path => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < path.length; i += 3) {
      points.push(new THREE.Vector3(path[i], path[i + 1], path[i + 2]));
    }
    const tempCurve = new THREE.CatmullRomCurve3(points);
    brainCurves.push(tempCurve);
  });

  return brainCurves;
}

const curves = createBrainCurvesFromPaths();

function App() {
  const { globalState } = useWebSocket();
  const prevMarketCapRef = useRef(0);

  useEffect(() => {
    // Calculate market cap (example calculation - adjust based on your tokenomics)
    const marketCap = globalState.age * 10000 * 1000000; // age * price * supply
    const prevMarketCap = prevMarketCapRef.current;

    // Check if market cap increased by 10k
    if (marketCap - prevMarketCap >= 10000) {
      console.log('Market Cap milestone reached: +$10k');
      prevMarketCapRef.current = marketCap;
      
      // Here you can trigger any effects you want when market cap increases by 10k
      // For example, adding new particles, changing colors, etc.
    }
  }, [globalState.age]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Canvas 
              camera={{ 
                position: [0, 0, 0.5], 
                near: 0.001, 
                far: 10,
                fov: 75 
              }}
              style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
            >
              <color attach="background" args={['#000005']} />
              <SpaceBackground />
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <OrbitControls 
                enableDamping={true}
                dampingFactor={0.05}
                rotateSpeed={0.5}
                enableZoom={true}
                mouseButtons={{
                  LEFT: THREE.MOUSE.ROTATE,
                  MIDDLE: THREE.MOUSE.DOLLY,
                  RIGHT: THREE.MOUSE.PAN
                }}
              />
              <Tubes curves={curves} />
              <BrainParticles curves={curves} />
            </Canvas>
            <AgeSimulation />
          </>
        } />
        <Route path="/diary" element={<Diary />} />
      </Routes>
    </Router>
  );
}

export default App;
