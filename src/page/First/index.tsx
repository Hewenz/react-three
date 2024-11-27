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
const First = () => {
    const classes = useStyles();
    useEffect(() => {
        const axesHelper = new THREE.AxesHelper(5);
        console.log("first");
        // 获取挂载节点
        const box = document.querySelector("#first");
        if (!box) return;

        // 场景与物品
        const scene = new THREE.Scene();
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x049ef4 });
        const materialP = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        materialP.wireframe = true;    //线框模式
        material.fog = true;
        const cube = new THREE.Mesh(geometry, material);
        const cubeP = new THREE.Mesh(geometry, materialP);
        cubeP.add(cube);
        cube.position.set(0, 2, 2);
        cubeP.position.set(0, 0, 0);
        cube.scale.set(2, 2, 2);
        scene.add(cubeP);
        scene.add(axesHelper);
        scene.fog = new THREE.Fog(0x3f7b9d, 1, 10);

        new Float32Array([1, 2, 3, 4, 5, 6]);
        //渲染器
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(box.clientWidth, box.clientHeight);
        box.appendChild(renderer.domElement);

        //相机
        const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);

        const controls = new OrbitControls(camera, renderer.domElement);

        function animate() {
            controls.update();
            requestAnimationFrame(animate);
            // cube.rotation.x += 0.01;
            // cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();

        const onResize = () => {
            camera.aspect = box.clientWidth / box.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(box.clientWidth, box.clientHeight);
        };
        window.addEventListener("resize", onResize);

        const eventObj = {
            test: () => {
                console.log("test");
            },
        };
        const gui = new GUI();
        gui.add(eventObj, "test");
        gui.add(cube.position, "x", -10, 10).step(1).name("cube_x");
        gui.addColor(material,"color").name("cube_color");
        const cubePFolder = gui.addFolder("cubeP");
        cubePFolder.add(materialP, "wireframe").name("wireframe");
        return () => {
            console.log("unmount");
            window.removeEventListener("resize", onResize);
            renderer.dispose();
            camera.clearViewOffset();
            box.removeChild(renderer.domElement);
        };
    }, []);

    // 同过
    return (
        <div id="first" className={classes.Container} />
    );
};

export default First;