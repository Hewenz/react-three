import React, { useEffect, useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import TWEEN from "@tweenjs/tween.js";
import * as CANNON from "cannon-es";

const useStyles = makeStyles({
    Container: {
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
    },
});

const createCamera = (ele: Element): THREE.PerspectiveCamera => {
    const camera = new THREE.PerspectiveCamera(75, ele.clientWidth / ele.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    return camera;
};

const createRenderer = (ele: Element) => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(ele.clientWidth, ele.clientHeight);
    ele.appendChild(renderer.domElement);
    return renderer;
}

const createControls = (camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
    const controls = new OrbitControls(camera, renderer.domElement);
    return controls;
}

type Options = {
    camera?: THREE.PerspectiveCamera, renderer?: THREE.WebGLRenderer, controls?: OrbitControls, animateTask?: () => void
}
type SimpleThree = (ele: Element, scene: THREE.Scene, options?: Options) => () => void;

const createSimpleThree: SimpleThree = (ele, scene, options) => {
    let { camera, renderer, controls, animateTask } = options || {};
    //摄像机
    if (!camera) camera = createCamera(ele);
    //渲染器
    if (!renderer) renderer = createRenderer(ele)
    //控制器
    if (!controls) controls = createControls(camera, renderer);

    let animationId: number;
    function animate() {
        animationId = requestAnimationFrame(animate);
        if (!controls || !renderer || !camera) return;
        if (animateTask) animateTask();
        controls.update();
        TWEEN.update();
        renderer.render(scene, camera);
    }
    animate();

    //监听窗口变化
    const onResize = () => {
        camera.aspect = ele.clientWidth / ele.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(ele.clientWidth, ele.clientHeight);
    };
    window.addEventListener("resize", onResize);
    return () => {
        console.log("unmount");
        window.removeEventListener("resize", onResize);
        scene.remove.apply(scene, scene.children);
        renderer.dispose();
        controls.dispose();
        camera.clearViewOffset();
        cancelAnimationFrame(animationId);
        ele.removeChild(renderer.domElement);
    };
};




const Cannon = () => {
    const classes = useStyles();
    useEffect(() => {

        const ele = document.getElementById("cannon");
        if (!ele) return;
        // 场景与物品
        const scene = new THREE.Scene();
        const geometry = new THREE.SphereGeometry(1, 32, 16);
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const material2 = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        const material3 = new THREE.MeshBasicMaterial({ color: 0x00ffff });

        const sphere = new THREE.Mesh(geometry, material);
        const box = new THREE.Mesh(boxGeometry, material2);
        const sphere3 = new THREE.Mesh(geometry, material3);
        sphere.position.set(-4, 0, 0);
        box.position.set(0, 0, 0);
        sphere3.position.set(4, 0, 0);
        scene.add(sphere);
        scene.add(box);
        scene.add(sphere3);

        //光源
        const light = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(light);

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        const planeGeometry = new THREE.BoxGeometry(20, 20, 0.1);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.position.set(0, -4, 0);
        planeMesh.rotation.x = -Math.PI / 2 + 0.1;
        scene.add(planeMesh);



        //创建物理引擎
        const World = new CANNON.World();
        //设置y轴方向的重力
        World.gravity.set(0, -9.82, 0);
        //创建球体
        const sphereShape = new CANNON.Sphere(1);
        //创建球体的刚体
        const sphereBody = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(-4, 0, 0),
            shape: sphereShape,
        });
        //创建盒子和其刚体
        const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        const boxBody = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 0, 0),
            shape: boxShape,
        });
        //创建平面和其刚体
        const planeShape = new CANNON.Box(new CANNON.Vec3(10, 0.1, 10));
        const planeBody = new CANNON.Body({
            mass: 0,
            shape: planeShape,
            position: new CANNON.Vec3(0, -4, 0),
        });
        //设置平面刚体旋转
        planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0.1);
        World.addBody(sphereBody);
        World.addBody(planeBody);
        World.addBody(boxBody);

        let clock = new THREE.Clock();
        const dispose = createSimpleThree(ele, scene, {
            animateTask: () => {
                let delta = clock.getDelta();
                World.step(1 / 60, delta, 5);
                sphere.position.copy(sphereBody.position);
                sphere.quaternion.copy(sphereBody.quaternion);
                box.position.copy(boxBody.position);
                box.quaternion.copy(boxBody.quaternion);
            }
        });
        return () => {
            dispose();
        };
    }, []);

    // 同过
    return (
        <div id="cannon" className={classes.Container} />
    );
};

export default Cannon;