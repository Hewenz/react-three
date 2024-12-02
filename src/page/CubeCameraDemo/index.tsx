import React, { useEffect } from "react";
import { makeStyles } from "@fluentui/react-components";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

const useStyles = makeStyles({
    Container: {
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
    },
});

const CubeCameraDemo = () => {
    const classes = useStyles();
    useEffect(() => {
        console.log("CubeCamera");
        const box = document.querySelector("#CubeCamera");
        if (!box) return;
        const scene = new THREE.Scene(); //创建场景
        // 创建立方体渲染目标
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
            format: 1022,
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter
        });

        // 创建立方体相机
        const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
        scene.add(cubeCamera);

        // 创建一个反射材质的球体
        const sphereMaterial = new THREE.MeshPhongMaterial({
            envMap: cubeRenderTarget.texture
        });
        const sphereGeometry = new THREE.SphereGeometry(10, 32, 32);
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(box.clientWidth, box.clientHeight);
        box.appendChild(renderer.domElement);

        // 在渲染循环中更新立方体相机
        let animationId: number;
        function animate() {
            animationId = requestAnimationFrame(animate);

            // 更新立方体相机
            sphere.visible = false; // 隐藏球体以避免自我反射
            cubeCamera.update(renderer, scene);
            sphere.visible = true; // 恢复球体可见性

            renderer.render(scene, camera);
        }

        const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        

        animate();
        return () => {
            console.log("unmount");
            scene.remove.apply(scene, scene.children);
            renderer.dispose();
            camera.clearViewOffset();
            cancelAnimationFrame(animationId);
            box.removeChild(renderer.domElement);
        };
    }, []);

    // 同过
    return (
        <div id="CubeCamera" className={classes.Container} />
    );
};

export default CubeCameraDemo;