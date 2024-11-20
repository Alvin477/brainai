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
  const prevTokenValueRef = useRef(0);

  useEffect(() => {
    const newValue = globalState.age * 5000;
    const prevValue = prevTokenValueRef.current;

    if (newValue - prevValue >= 5000) {
      console.log('Token value increased by $5000');
      prevTokenValueRef.current = newValue;
    }
  }, [globalState.age]);

  return (
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
  );
}

export default App;
