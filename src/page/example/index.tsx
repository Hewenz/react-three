import { Canvas, extend, MeshProps, useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three'
import { Debug, Physics, useBox, usePlane, useSphere, useTrimesh } from '@react-three/cannon';
import { useEffect, useRef, useState } from "react";
import { button, useControls } from "leva";
import { DragControls, Environment, Grid, MeshTransmissionMaterial, OrbitControls, Outlines, useHelper, useGLTF } from "@react-three/drei";


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
            <planeGeometry args={[40, 40]} />
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
            <meshStandardMaterial toneMapped={false} vertexColors />
            <sphereGeometry args={[1, 32, 16]}>
                <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
            </sphereGeometry>
        </instancedMesh>
    )
}

function Clump2({ mat = new THREE.Matrix4(), vec = new THREE.Vector3(), ...props }) {
    const [ref, api] = useSphere<any>(() => ({ args: [1], mass: 0.5, angularDamping: 0.5, linearDamping: 0.65, position: [rfs(20), rfs(20), rfs(20)] }))

    useFrame((state) => {
        for (let i = 0; i < 3; i++) {
            ref.current.getMatrixAt(i, mat)
            api.at(i).applyForce(vec.setFromMatrixPosition(mat).normalize().multiplyScalar(-20).toArray(), [0, 0, 0])
        }
    })

    return (
        <instancedMesh ref={ref} castShadow receiveShadow args={[undefined, undefined, 3]}>
            <MeshTransmissionMaterial color="white" />
            <sphereGeometry args={[1, 32, 16]} />
        </instancedMesh>
    )
}

function Sphere(props: MeshProps) {
    // const ref = useRef<THREE.Mesh>(null)
    const [ref, api] = useSphere<THREE.Mesh>(() => ({ args: [2, 32, 16], mass: 5, ...props as any }));
    useControls("Sphere", {
        "reset": button(() => {
            api.velocity.set(0, 0, 0);
            api.angularVelocity.set(0, 0, 0);
            api.position.set(10, 10, 5);
        }),
    });
    return (
        <mesh
            ref={ref}
            onPointerDown={() => {
                const position = new THREE.Vector3();
                ref.current!.getWorldPosition(position);
                const force = position.clone().negate().normalize().multiplyScalar(16000);
                api.applyForce(force.toArray(), [0, 0, 0]);
                console.log('click')
            }}
        >
            <meshStandardMaterial color="white" >
            </meshStandardMaterial>
            {/* <Outlines thickness={1} /> */}
            <sphereGeometry args={[2, 32, 16]}/>
        </mesh>
    )
}

const SpotLight = () => {
    const ref = useRef<THREE.SpotLight>(null);
    useHelper((ref as any), THREE.SpotLightHelper, "red");
    return <spotLight
        color={"white"}
        ref={ref}
        intensity={1}
        angle={Math.PI / 4}
        decay={0}
        penumbra={1}
        position={[20, 20, 20]}
        castShadow
    />
}
const findGeometry = (object: any) => {
    let geometries: any = [];
    object.traverse((child: any) => {
        if (child.isMesh) {
            geometries.push(child.geometry);
        }
    });
    return geometries;
};
const Shiba = () => {
    const gltf = useGLTF('models/shiba/scene.gltf')
    const geometries = findGeometry(gltf.scene);
    const vertices = geometries.flatMap((geometry: any) => Array.from(geometry.attributes.position.array));
    const indices = geometries.flatMap((geometry: any) => Array.from(geometry.index.array));
    console.log(geometries);


    const [ref, api] = useTrimesh<THREE.Mesh>(() => ({
        mass: 3,
        args: [vertices, indices],
        position: [5, 5, 0]
    }));

    useControls("Shiba", {
        "reset": button(() => {
            api.velocity.set(0, 0, 0);
            api.angularVelocity.set(0, 0, 0);
            api.position.set(5, 5, 0);
        }),
    });
    return (
        <mesh ref={ref} onPointerDown={() => {
            const position = new THREE.Vector3();
            ref.current!.getWorldPosition(position);
            const force = position.clone().negate().normalize().multiplyScalar(8000);
            api.applyForce(force.toArray(), [0, 0, 0]);
            console.log('click')
        }}>
            <primitive object={gltf.scene} />
        </mesh>
    );
}

const ReflectiveSphere = () => {
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter
    });
    const [ref, api] = useSphere<THREE.Mesh>(() => ({ args: [1], mass: 5 }));
    const cubeCamera = useRef<THREE.CubeCamera>(null);
    // const sphereRef = useRef<THREE.Mesh>(null);

    useFrame(({ gl, scene }) => {
        const position = new THREE.Vector3();
        ref.current!.getWorldPosition(position);
        const force = position.clone().normalize().multiplyScalar(-20);
        api.applyForce(force.toArray(), [0, 0, 0]);
        if (ref.current) {
            ref.current.visible = false;
            cubeCamera.current!.update(gl, scene);
            ref.current.visible = true;
        }
    });

    return (
        <>
            <mesh ref={ref} position={[-10, 10, 10]}>
                <cubeCamera ref={cubeCamera} args={[0.1, 1000, cubeRenderTarget]} />
                <sphereGeometry args={[1, 32, 16]} />
                <meshPhongMaterial envMap={cubeRenderTarget.texture} />
            </mesh>
        </>
    );
};


const Example = () => {
    const [isDragging, setDragging] = useState(false);
    return <>
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 15, 15], fov: 70, near: 1, far: 1000 }}>
            <color attach="background" args={['#dfdfdf']} />
            <ambientLight intensity={0.6} />
            {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow /> */}
            <SpotLight />
            {!isDragging && <OrbitControls />}
            <axesHelper />
            <Physics gravity={[0, 0, 0]} iterations={10}>
                {/* <DragControls onDragStart={() => setDragging(true)} onDragEnd={() => { setDragging(false) }}>
                    <Box position={[-2, 0, 5]} castShadow isDragging={isDragging} />
                </DragControls> */}
                <Sphere position={[10, 10, 5]} />
                <Environment files={"assets/goegap_road_1k.hdr"} />
                <Clump2 />
                <Clump />
                <Plane position={[0, -5, 0]} receiveShadow />
                <Shiba />
                <ReflectiveSphere />
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