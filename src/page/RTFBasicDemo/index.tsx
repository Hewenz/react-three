import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three'
import { useRef } from 'react';

const Box = () => {
    const boxMesh = useRef<THREE.Mesh>(null);
    useFrame(() => {
        if (!boxMesh.current) return;
        boxMesh.current.rotation.x += 0.01
        boxMesh.current.rotation.y += 0.01
    })
    return <mesh position={[0, 2, 2]} ref={boxMesh}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color={0x049ef4} />
    </mesh>
}

const RTFBasicDemo = () => {
    return <Canvas camera={{ position: [5, 5, 5] }} >
        <OrbitControls />
        <Box />
    </Canvas>
}

export default RTFBasicDemo;