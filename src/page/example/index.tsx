import { Canvas, extend, MeshProps, useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three'
import { Debug, Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { useEffect, useRef, useState } from "react";
import { useControls } from "leva";
import { DragControls, Grid, MeshTransmissionMaterial, OrbitControls, Outlines, useHelper } from "@react-three/drei";


const rfs = THREE.MathUtils.randFloatSpread
const getColors = () => {
    const colors = new Float32Array(20 * 3)
    for (let i = 0; i < 20; i++) {
        const color = new THREE.Color(Math.random(), Math.random(), Math.random());
        color.toArray(colors, i * 3);
    }
    return colors
}

const Plane = (props: MeshProps) => {
    const [ref] = usePlane<THREE.Mesh>(() => ({ rotation: [-Math.PI / 2 + .1, 0, 0], ...props as any }))

    return (
        <mesh {...props} ref={ref} >
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="lightblue" side={THREE.DoubleSide} />
        </mesh>
    )
};

function Box(props: MeshProps & { isDragging?: boolean }) {
    // const ref = useRef<THREE.Mesh>(null)
    const [ref, api] = useBox<THREE.Mesh>(() => ({ mass: 1, ...props as any }))

    useFrame((state, delta) => {
        // if (ref.current)
        //     ref.current.rotation.x += speed * delta
    })
    return (
        <mesh
            {...props}
            ref={ref}
            scale={1}
        >
            <boxGeometry args={[1, 1, 1]} />
            <MeshTransmissionMaterial />
            <Outlines thickness={1} />
        </mesh>
    )
}

function Clump({ mat = new THREE.Matrix4(), vec = new THREE.Vector3(), ...props }) {
    const { outlines } = useControls({ outlines: { value: 1, step: 0.01, min: 0, max: 1 } })
    // const texture = useTexture("/cross.jpg")
    const [ref, api] = useSphere<any>(() => ({ args: [1], mass: 0.5, angularDamping: 0.5, linearDamping: 0.65, position: [rfs(20), rfs(20), rfs(20)] }))

    const colors = getColors()

    useFrame((state) => {
        for (let i = 0; i < 20; i++) {
            ref.current.getMatrixAt(i, mat)
            api.at(i).applyForce(vec.setFromMatrixPosition(mat).normalize().multiplyScalar(-20).toArray(), [0, 0, 0])
        }
    })

    return (
        <instancedMesh ref={ref} castShadow receiveShadow args={[undefined, undefined, 20]}>
            <Outlines thickness={outlines} />
            <meshStandardMaterial  toneMapped={false} vertexColors />
            <sphereGeometry args={[1, 32, 16]}>
                <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
            </sphereGeometry>
        </instancedMesh>
    )
}

function Sphere(props: MeshProps) {
    // const ref = useRef<THREE.Mesh>(null)
    const [ref, api] = useSphere<THREE.Mesh>(() => ({ args: [2, 32, 16], mass: 1, ...props as any }));

    return (
        <mesh
            ref={ref}
            onPointerDown={() => {
                const position = new THREE.Vector3();
                ref.current!.getWorldPosition(position);
                const force = position.clone().negate().normalize().multiplyScalar(4000);
                api.applyForce(force.toArray(), [0, 0, 0]);
                console.log('click')
            }}
        >
            <meshStandardMaterial color="white" />
            {/* <Outlines thickness={1} /> */}
            <sphereGeometry />
        </mesh>
    )
}

const SpotLight = () => {
    const ref = useRef<THREE.SpotLight>(null);
    useHelper((ref as any), THREE.SpotLightHelper, "red");
    return <spotLight
        color={"white"}
        ref={ref}
        intensity={5}
        angle={Math.PI / 4}
        decay={0}
        penumbra={1}
        position={[20, 20, 20]}
        castShadow
    />
}


const Example = () => {
    const [isDragging, setDragging] = useState(false);
    return <>
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 15, 15], fov: 70, near: 1, far: 1000 }}>
            <color attach="background" args={['#dfdfdf']} />
            <ambientLight intensity={2} />
            {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow /> */}
            <SpotLight />
            {!isDragging && <OrbitControls />}
            <axesHelper />
            <Physics gravity={[0, 0, 0]} iterations={10}>
                {/* <DragControls onDragStart={() => setDragging(true)} onDragEnd={() => { setDragging(false) }}>
                    <Box position={[-2, 0, 5]} castShadow isDragging={isDragging} />
                </DragControls> */}
                <Sphere position={[10, 10, 5]} />

                <Clump />
                <Plane position={[0, -5, 0]} receiveShadow />

                <Debug color="black" scale={1.1}>
                    {/* <Box position={[0, 0, 5]} /> */}
                    {/* <Plane position={[0, 0, -10]} rotation={[0, 0, 0]} receiveShadow />
                    <Plane position={[0, 0, 10]} rotation={[Math.PI, 0, 0]} receiveShadow />
                    <Plane position={[10, 0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow />
                    <Plane position={[-10, 0, 0]} rotation={[Math.PI, Math.PI / 2, 0]} receiveShadow /> */}
                </Debug>
            </Physics>
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
    </>
}

export default Example;