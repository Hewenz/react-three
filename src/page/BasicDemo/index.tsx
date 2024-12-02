import React, { useEffect } from "react";
import { makeStyles } from "@fluentui/react-components";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


const useStyles = makeStyles({
    Container: {
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
        background:"#D5D5D5"
    },
});

const BasicDemo = () => {
    const classes = useStyles();
    useEffect(() => {
        console.log("BasicDemo");
        // 获取挂载节点
        const box = document.querySelector("#BasicDemo");
        if (!box) return;

        // 场景
        const scene = new THREE.Scene(); //创建场景
        scene.background = new THREE.Color("white");


        // 物体
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); //创建几何体
        // const geometry = new THREE.SphereGeometry(1, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x049ef4 }); //创建材质
        const cube = new THREE.Mesh(geometry, material); //创建物体 物体由材质与几何体组成
        cube.position.set(0, 2, 2);
        scene.add(cube);

        //渲染器
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(box.clientWidth, box.clientHeight);
        box.appendChild(renderer.domElement);

        //相机
        const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);

        //控制器
        const controls = new OrbitControls(camera, renderer.domElement);

        // 渲染
        let animationId: number;
        function animate() {
            controls.update();
            animationId = requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();
        return () => {
            console.log("unmount");
            scene.remove.apply(scene, scene.children);
            renderer.dispose();
            controls.dispose();
            camera.clearViewOffset();
            cancelAnimationFrame(animationId);
            box.removeChild(renderer.domElement);
        };
    }, []);

    // 同过
    return (
        <div id="BasicDemo" className={classes.Container} />
    );
};

export default BasicDemo;