import { Canvas, MeshProps, useFrame } from '@react-three/fiber'
import { DragControls, OrbitControls, useHelper } from '@react-three/drei';
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react';
import { useControls } from 'leva';

const Box = (props: MeshProps) => {
    const boxMesh = useRef<THREE.Mesh>(null);
    useFrame(() => {
        if (!boxMesh.current) return;
        boxMesh.current.rotation.x += 0.01
        boxMesh.current.rotation.y += 0.01
    })
    return <mesh position={[0, 2, 0]} ref={boxMesh} castShadow {...props}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={0x049ef4} />
    </mesh>
}

const Plane = (props: MeshProps) => {
    return <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow {...props}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color={"white"} />
    </mesh>
}

const PointLight = () => {
    const ref = useRef<THREE.PointLight>(null);
    useHelper((ref as any), THREE.PointLightHelper);
    const { decay, intensity, castShadow, position } = useControls({
        color: "white",
        distance: {
            value: 20,
            min: 0,
            max: 100,
            step: 5
        },
        decay: {
            value: 0,
            min: 0,
            max: 1,
            step: 0.1
        },
        intensity: {
            value: 5,
            min: 0,
            max: 20,
            step: 1
        },
        position: [5, 5, 5],
        castShadow: true,
    });
    return <pointLight
        ref={ref}
        position={position}
        decay={decay}
        intensity={intensity}
        castShadow={castShadow}
    />
}

const SpotLight = ({ target }: { target: any }) => {
    const ref = useRef<THREE.SpotLight>(null);
    useHelper((ref as any), THREE.SpotLightHelper, "red");
    const { color, distance, decay, intensity, angle, castShadow, position } = useControls({
        color: "white",
        distance: {
            value: 20,
            min: 0,
            max: 100,
            step: 5
        },
        decay: {
            value: 0,
            min: 0,
            max: 1,
            step: 0.1
        },
        intensity: {
            value: 5,
            min: 0,
            max: 20,
            step: 1
        },
        angle: {
            value: Math.PI / 4,
            min: 0,
            max: Math.PI / 2,
            step: 0.01
        },
        position: [5, 5, 5],
        castShadow: true,
    });

    useFrame(() => {
        if (ref.current && target.current) {
            ref.current.target = target.current;
        }
    });

    return <spotLight
        ref={ref}
        color={color}
        position={position}
        decay={decay}
        distance={distance}
        angle={angle}
        intensity={intensity}
        castShadow={castShadow}
    />

}

const DirectionalLight = ({ target }: { target: any }) => {
    const ref = useRef<THREE.DirectionalLight>(null);
    useHelper((ref as any), THREE.DirectionalLightHelper, 1, "red");
    const { color, position, intensity, castShadow } = useControls({
        color: "white",
        position: [5, 5, 5],
        intensity: {
            value: 5,
            min: 0,
            max: 20,
            step: 1
        },
        castShadow: true,
    });


    useFrame(() => {
        if (ref.current && target.current) {
            ref.current.target = target.current;
        }
    });

    return <>
        <directionalLight
            ref={ref}
            castShadow={castShadow}
            color={color}
            position={position}
            intensity={intensity}
        />
    </>
}



const LightDemo = () => {
    const boxMesh = useRef<THREE.Mesh>(null);
    const [isDrag, setIsDrag] = useState(false)
    useEffect(() => {
        console.log(boxMesh)
    }, [boxMesh])
    return <>
        <Canvas camera={{ position: [5, 5, 5] }} style={{ background: "black" }} shadows >
            <axesHelper />
            <ambientLight intensity={1} />
            <PointLight />
            {/* <SpotLight target={boxMesh} /> */}
            {/* <DirectionalLight target={boxMesh} /> */}
            {!isDrag && <OrbitControls />}
            <DragControls onDragStart={() => setIsDrag(true)} onDragEnd={() => setIsDrag(false)}>
                <mesh position={[0, 2, 0]} ref={boxMesh} castShadow>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshLambertMaterial color={0x049ef4} />
                </mesh>
            </DragControls>
            <Box position={[2, 2, 0]} />
            <Plane />
        </Canvas>
    </>
}

export default LightDemo;