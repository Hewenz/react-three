import React, { useEffect, useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const useStyles = makeStyles({
    Container: {
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
    },
});

const useSimpleThree = (box: Element | null, scene?: THREE.Scene) => {
    useEffect(() => {
        if (!box || !scene) return;
        const axesHelper = new THREE.AxesHelper(5);
        // 场景与物品
        scene.add(axesHelper);

        const light = new THREE.AmbientLight(0x404040); // soft white light
        light.intensity = 80;
        scene.add(light);

        //渲染器
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(box.clientWidth, box.clientHeight);
        box.appendChild(renderer.domElement);

        //相机
        const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);

        const controls = new OrbitControls(camera, renderer.domElement);

        let animationId: number;
        function animate() {
            controls.update();
            animationId = requestAnimationFrame(animate);
            if (!scene) return;
            renderer.render(scene, camera);
        }
        animate();

        const onResize = () => {
            camera.aspect = box.clientWidth / box.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(box.clientWidth, box.clientHeight);
        };
        window.addEventListener("resize", onResize);
        return () => {
            console.log("unmount");
            window.removeEventListener("resize", onResize);
            scene.remove.apply(scene, scene.children); //与scene.remove(...scene.children)等价
            renderer.dispose();
            controls.dispose();
            camera.clearViewOffset();
            cancelAnimationFrame(animationId);
            box.removeChild(renderer.domElement);
        };
    }, [box, scene]);
    return {};
};

const Third = () => {
    const classes = useStyles();
    const box = document.querySelector("#third");
    const [scene, setScene] = useState<THREE.Scene>();
    useSimpleThree(box, scene);
    useEffect(() => {

        // 场景与物品
        const scene = new THREE.Scene();

        const loader = new GLTFLoader();
        loader.load('./models/shiba/scene.gltf', function (gltf) {
            console.log(gltf);
            scene.add(gltf.scene);
        });
        loader.load('./models/60s_office_props.glb', function (gltf) {
            console.log(gltf);
            scene.add(gltf.scene);
        });
        setScene(scene);
    }, []);

    // 同过
    return (
        <div id="third" className={classes.Container} />
    );
};

export default Third;