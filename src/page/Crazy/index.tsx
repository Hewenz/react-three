import React, { useRef, useState } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import type { MeshProps, SpotLightProps, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { BakeShadows, Grid, OrbitControls, useHelper } from '@react-three/drei';
import { useControls } from 'leva';
import { Physics, useBox, usePlane } from '@react-three/cannon';

function Box(props: MeshProps) {
    // const ref = useRef<THREE.Mesh>(null)
    const [ref, api] = useBox<THREE.Mesh>(() => ({ mass: 1, ...props as any }))
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    const { speed } = useControls("SPEED", {
        speed: {
            value: 0,
            min: -20,
            max: 20,
        }
    });

    // 控制物体位置
    const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
        if (event.buttons === 1) { // 检查鼠标左键是否按下
            console.log(event.point.x, 2, event.point.z);
            api.position.set(event.point.x, 2, event.point.z);
            api.sleep();
        }
    };

    useFrame((state, delta) => {
        // if (ref.current)
        //     ref.current.rotation.x += speed * delta
    })
    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}
            // onPointerMove={handlePointerMove}
            // onPointerUp={(event) => {
            //     api.wakeUp();
            // }}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'white'} />
        </mesh>
    )
}

const Plane = (props: MeshProps) => {
    const [ref] = usePlane<THREE.Mesh>(() => ({ rotation: [-Math.PI / 2 + .5, 0, 0], ...props as any }))

    return (
        <mesh {...props} ref={ref} >
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="lightblue" side={THREE.DoubleSide} />
        </mesh>
    )
};

const Light = (props: SpotLightProps) => {
    const ref = useRef<THREE.SpotLight>(null);
    const helper = useHelper((ref as any), THREE.SpotLightHelper, "red");
    const { color, distance, decay, intensity, angle, castShadow } = useControls({
        color: "#ff0000",
        distance: 10,
        decay: 0,
        intensity: 30,
        angle: 0.6,
        castShadow: true,
    });
    return (
        <spotLight
            {...props}
            castShadow={castShadow}
            ref={ref}
            position={[3, 3, 3]}
            distance={distance}
            decay={decay}
            intensity={intensity}
            color={color}
            angle={angle}
        />
    )
};

const Crazy = () => {

    return (
        <Canvas camera={{ position: [0, 10, 0] }} shadows>
            <ambientLight intensity={Math.PI / 2} />
            {/* <BakeShadows /> */}
            {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} /> */}
            <Light />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <Physics>
                <Box position={[-1.2, 0, 0]} castShadow />
                <Box position={[1.2, 0, 0]} />
                <Plane position={[0, -1, 0]} receiveShadow />
            </Physics>
            <OrbitControls />
            <Grid
                sectionSize={3}
                sectionColor={'purple'}
                sectionThickness={1}
                cellSize={1}
                cellColor={'#6f6f6f'}
                cellThickness={0.6}
                infiniteGrid
                fadeDistance={50}
                fadeStrength={5}
                position={[0, -2, 0]}
            />
        </Canvas>
    )
};

export default Crazy;