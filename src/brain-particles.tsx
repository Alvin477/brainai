import React, { useState, useEffect } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useWebSocket } from './hooks/useWebSocket';

const PARTICLE_LIFETIME = 10000; // Particle lives for 10 seconds (in milliseconds)

export const BrainParticleMaterial = shaderMaterial(
  { 
    time: 0, 
    color: new THREE.Color(0.1, 0.3, 0.6),
  },
  // vertex shader
  /*glsl*/ `
    varying vec2 vUv;
    uniform float time;
    varying float vProgress;
    attribute float randoms;
    attribute float opacity;
    varying float vOpacity;
    varying float vRandom;
    
    void main() {
      vUv = uv;
      vRandom = randoms;
      vOpacity = opacity;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = randoms * 15.0 * (1. / -mvPosition.z) * (1.0 + sin(time * 10.0 + randoms * 10.0) * 0.3);
    }
  `,
  // fragment shader
  /*glsl*/ `
    uniform float time;
    varying float vOpacity;
    varying float vRandom;
    
    void main() {
      float disc = length(gl_PointCoord.xy - vec2(0.5));
      
      float flicker = sin(time * 12.0 + vRandom * 20.0) * 0.2 + 0.8;
      float sparkle = sin(time * 20.0 + vRandom * 30.0) * 0.15 + 0.85;
      
      float opacity = vOpacity * smoothstep(0.5, 0.35, disc) * flicker * sparkle * 1.5;
      
      vec3 color = mix(
        vec3(0.7, 0.9, 1.0),  // Very bright blue
        vec3(0.3, 0.7, 1.0),  // Bright medium blue
        sin(time * 5.0 + vRandom * 10.0) * 0.5 + 0.5
      );
      
      gl_FragColor = vec4(color, opacity);
    }
  `,
);

extend({ BrainParticleMaterial });

export function BrainParticles(props: { curves: THREE.CatmullRomCurve3[] }) {
  const { curves } = props;
  const { globalState } = useWebSocket();
  const [particles, setParticles] = useState<{
    id: string;
    curve: THREE.CatmullRomCurve3;
    position: number;
    speed: number;
    startTime: number;
    opacity: number;
    isPaused?: boolean;
  }[]>([]);
  
  const [tooltipInfo, setTooltipInfo] = useState<{
    show: boolean;
    position: THREE.Vector3;
    transactionId: string;
    particleIndex: number;
  } | null>(null);

  const { camera, raycaster } = useThree();
  const brainGeo = React.useRef<THREE.BufferGeometry>(null!);
  const pointsRef = React.useRef<THREE.Points>(null!);
  const materialRef = React.useRef<THREE.ShaderMaterial>(null!);

  useEffect(() => {
    if (globalState.transaction && typeof globalState.transaction === 'string') {
      setParticles(prev => [...prev, {
        id: globalState.transaction as string,
        curve: curves[Math.floor(Math.random() * curves.length)],
        position: 0,
        speed: 0.003 + Math.random() * 0.004,
        startTime: Date.now(),
        opacity: 0
      }]);
    }
  }, [globalState.transaction, curves]);

  const handleClick = (event: MouseEvent | TouchEvent) => {
    if (!pointsRef.current || particles.length === 0) return;

    // Get correct coordinates based on event type
    let x, y;
    if (event instanceof MouseEvent) {
      x = (event.clientX / window.innerWidth) * 2 - 1;
      y = -(event.clientY / window.innerHeight) * 2 + 1;
    } else {
      x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    }

    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const intersects = raycaster.intersectObject(pointsRef.current);

    // Click outside - close tooltip
    if (intersects.length === 0) {
      setTooltipInfo(null);
      return;
    }

    const intersect = intersects[0];
    if (intersect?.index !== undefined) {
      const particle = particles[intersect.index];
      
      if (particle) {
        // Toggle pause state for clicked particle
        setParticles(current => current.map((p, idx) => 
          idx === intersect.index ? { ...p, isPaused: !p.isPaused } : p
        ));
        
        const worldPosition = new THREE.Vector3();
        worldPosition.fromBufferAttribute(
          pointsRef.current.geometry.attributes.position,
          intersect.index
        );
        worldPosition.applyMatrix4(pointsRef.current.matrixWorld);

        // Only update if clicking a different particle or reopening
        if (!tooltipInfo || tooltipInfo.transactionId !== particle.id) {
          setTooltipInfo({
            show: true,
            position: worldPosition,
            transactionId: particle.id,
            particleIndex: intersect.index
          });
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleClick);
    
    // Add document-level click listener for closing
    const handleDocumentClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (tooltipInfo && !target.closest('.particle-tooltip')) {
        setTooltipInfo(null);
      }
    };
    
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('touchstart', handleDocumentClick);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleClick);
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('touchstart', handleDocumentClick);
    };
  }, [tooltipInfo, particles]);

  const Tooltip = ({ position, transactionId }: { position: THREE.Vector3, transactionId: string }) => (
    <Html position={[position.x, position.y, position.z]}>
      <div 
        className="particle-tooltip"
        style={{
          position: 'absolute',
          background: 'rgba(13, 17, 28, 0.85)',
          padding: '8px 16px',
          borderRadius: '12px',
          color: '#fff',
          fontSize: '14px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          pointerEvents: 'auto',
          border: '1px solid rgba(64, 153, 255, 0.3)',
          backdropFilter: 'blur(8px)',
          boxShadow: `
            0 0 10px rgba(64, 153, 255, 0.2),
            0 0 20px rgba(64, 153, 255, 0.1),
            inset 0 0 8px rgba(64, 153, 255, 0.1)
          `,
          transform: 'translate3d(-50%, -150%, 0)',
          zIndex: 9999,
          textShadow: '0 0 8px rgba(64, 153, 255, 0.5)',
          isolation: 'isolate'
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          window.open(`https://solscan.io/tx/${transactionId}`, '_blank');
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          window.open(`https://solscan.io/tx/${transactionId}`, '_blank');
        }}
      >
        <span style={{ pointerEvents: 'none' }}>
          View Electric Origin
        </span>
      </div>
    </Html>
  );

  useFrame(({ clock }) => {
    if (!brainGeo.current || particles.length === 0) return;

    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }

    const now = Date.now();
    
    setParticles(currentParticles => {
      return currentParticles.map(particle => {
        const age = now - particle.startTime;
        const fadeInDuration = 1000; // 1 second fade in
        const fadeOutStart = PARTICLE_LIFETIME - 1000; // 1 second fade out

        // Calculate opacity based on age
        let opacity = particle.opacity;
        if (age < fadeInDuration) {
          // Fade in
          opacity = age / fadeInDuration;
        } else if (age > fadeOutStart) {
          // Fade out
          opacity = 1 - (age - fadeOutStart) / (PARTICLE_LIFETIME - fadeOutStart);
        } else {
          // Full opacity
          opacity = 1;
        }

        return {
          ...particle,
          position: particle.isPaused ? particle.position : (particle.position + particle.speed) % 1,
          opacity: Math.max(0, Math.min(1, opacity))
        };
      }).filter(particle => {
        const age = now - particle.startTime;
        return age < PARTICLE_LIFETIME;
      });
    });

    const positions = new Float32Array(particles.length * 3);
    const opacities = new Float32Array(particles.length);
    const randoms = new Float32Array(particles.length);

    particles.forEach((particle, i) => {
      const pos = particle.curve.getPointAt(particle.position);
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;
      opacities[i] = particle.opacity;
      randoms[i] = 0.5 + Math.random() * 0.5;
    });

    brainGeo.current.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    brainGeo.current.setAttribute(
      'opacity',
      new THREE.BufferAttribute(opacities, 1)
    );
    brainGeo.current.setAttribute(
      'randoms',
      new THREE.BufferAttribute(randoms, 1)
    );

    // Update tooltip position and handle particle lifetime
    if (tooltipInfo && tooltipInfo.particleIndex !== undefined) {
      const particle = particles[tooltipInfo.particleIndex];
      if (particle) {
        const age = Date.now() - particle.startTime;
        
        // Close tooltip if particle is about to vanish
        if (age >= PARTICLE_LIFETIME - 1000) {
          setTooltipInfo(null);
        } else {
          const pos = particle.curve.getPointAt(particle.position);
          tooltipInfo.position.set(pos.x, pos.y, pos.z);
        }
      } else {
        // Particle no longer exists
        setTooltipInfo(null);
      }
    }
  });

  if (particles.length === 0) return null;

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry attach="geometry" ref={brainGeo}>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length}
            array={new Float32Array(particles.length * 3)}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-opacity"
            count={particles.length}
            array={new Float32Array(particles.length)}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-randoms"
            count={particles.length}
            array={new Float32Array(particles.length)}
            itemSize={1}
          />
        </bufferGeometry>
        <brainParticleMaterial
          ref={materialRef}
          attach="material"
          depthTest={false}
          depthWrite={false}
          transparent={true}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {tooltipInfo && tooltipInfo.show && (
        <Tooltip 
          position={tooltipInfo.position}
          transactionId={tooltipInfo.transactionId}
        />
      )}
    </>
  );
}
