import React, { useEffect } from "react";
import { makeStyles } from "@fluentui/react-components";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

const useStyles = makeStyles({
    Container: {
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
    },
});

const Controls = () => {
    const classes = useStyles();
    useEffect(() => {
        console.log("Controls");
        const box = document.querySelector("#Controls");
        if (!box) return;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#D3D3D3");

        const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(box.clientWidth,  box.clientHeight);
        box.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        const cube2 = new THREE.Mesh(geometry, material);

        cube.position.x = 2;

        scene.add(cube);
        scene.add(cube2);


        // 平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        camera.position.z = 5;

        const controls = new OrbitControls(camera, renderer.domElement);
        const dragControls = new DragControls([cube], camera, renderer.domElement);

        // 禁用 OrbitControls 在拖拽时
        dragControls.addEventListener('dragstart', function (event) {
            controls.enabled = false;
        });

        dragControls.addEventListener('dragend', function (event) {
            controls.enabled = true;
        });
        let animationId: number;
        function animate() {
            animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate()
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
        <div id="Controls" className={classes.Container} />
    );
};

export default Controls;