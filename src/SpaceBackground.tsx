import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

const StarFieldMaterial = shaderMaterial(
  {
    time: 0,
    mouse: new THREE.Vector2(0, 0),
  },
  // Vertex Shader
  `
    attribute float size;
    attribute vec3 velocity;
    varying vec3 vVelocity;
    uniform float time;
    uniform vec2 mouse;
    
    void main() {
      vVelocity = velocity;
      vec3 pos = position;
      
      // Spherical distribution
      float radius = 2.0;
      float theta = time * velocity.x * 0.1;
      float phi = time * velocity.y * 0.1;
      
      pos.x += radius * sin(theta) * cos(phi);
      pos.y += radius * sin(theta) * sin(phi);
      pos.z += radius * cos(theta);
      
      // Mouse interaction
      float dist = length(mouse - pos.xy);
      if(dist < 0.5) {
        pos.xy += normalize(pos.xy - mouse) * (0.5 - dist) * 0.3;
      }
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * (2.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    varying vec3 vVelocity;
    
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      
      vec3 color = mix(
        vec3(0.2, 0.5, 1.0),  // Deep blue
        vec3(0.7, 0.9, 1.0),  // Bright blue
        smoothstep(0.0, 1.0, length(vVelocity) * 20.0)
      );
      
      float alpha = (1.0 - dist * 2.0) * 0.8;
      gl_FragColor = vec4(color, alpha);
    }
  `
);

export function SpaceBackground() {
  const count = 3000;
  const particlesRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const [positions, sizes, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 1 + Math.random() * 2;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random orbital velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;

      // Varied sizes for depth effect
      sizes[i] = Math.random() * 1.5 + 0.5;
    }

    return [positions, sizes, velocities];
  }, []);

  useFrame(({ clock, mouse, viewport }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      materialRef.current.uniforms.mouse.value.set(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2
      );
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-velocity"
          count={count}
          array={velocities}
          itemSize={3}
        />
      </bufferGeometry>
      <primitive object={new StarFieldMaterial()} ref={materialRef} />
    </points>
  );
}