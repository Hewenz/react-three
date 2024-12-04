import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Environment, MeshTransmissionMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { useRef } from 'react';

const PanoramicSphere = () => {
    const hdrTexture = useLoader(RGBELoader, 'assets/goegap_road_1k.hdr');
    hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

    return (
        <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshTransmissionMaterial envMap={hdrTexture} map={hdrTexture} />
        </mesh>
    );
};

const Panoramic = () => {
    const hdrTexture = useLoader(RGBELoader, '/assets/goegap_road_1k.hdr');
    hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

    return <Canvas scene={{ background: hdrTexture }}>
        <perspectiveCamera position={[5, 5, 5]} />
        <OrbitControls />
    </Canvas>
}

const ReflectiveSphere = () => {
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter
    });
    const cubeCamera = useRef<THREE.CubeCamera>(null);
    const sphereRef = useRef<THREE.Mesh>(null);

    useFrame(({ gl, scene }) => {
        if (sphereRef.current) {
            sphereRef.current.visible = false;
            cubeCamera.current!.update(gl, scene);
            sphereRef.current.visible = true;
        }
    });

    return (
        <>
            <mesh ref={sphereRef} position={[-5, 0, 0]}>
                <cubeCamera ref={cubeCamera} args={[0.1, 1000, cubeRenderTarget]} />
                <sphereGeometry args={[1, 32, 16]} />
                <meshPhongMaterial envMap={cubeRenderTarget.texture} />
            </mesh>
        </>
    );
};

const Panoramic2 = () => {
    const hdrTexture = useLoader(RGBELoader, '/assets/goegap_road_1k.hdr');
    hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

    return <Canvas>
        <primitive attach="background" object={hdrTexture} />
        <ambientLight intensity={1} />
        <PanoramicSphere />
        <ReflectiveSphere />
        {/* <Environment files={"assets/goegap_road_1k.hdr"} background /> */}
        <perspectiveCamera position={[5, 5, 5]} />
        <OrbitControls />
    </Canvas>
}

export default Panoramic2;