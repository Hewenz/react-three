import React, { useEffect } from "react";
import { makeStyles } from "@fluentui/react-components";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from 'three/examples/jsm/controls/DragControls';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

const useStyles = makeStyles({
    Container: {
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
    },
});

const Demo = () => {
    const classes = useStyles();
    useEffect(() => {
        console.log("Demo");
        // 获取挂载节点
        const box = document.querySelector("#Demo");
        if (!box) return;

        // 场景与物品
        const scene = new THREE.Scene(); //创建场景
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); //创建几何体
        const planeGeometry = new THREE.PlaneGeometry(20, 20);
        const material = new THREE.MeshStandardMaterial({ color: 0x049ef4 }); //创建材质
        const materialP = new THREE.MeshStandardMaterial({ color: 0x00ffff });
        const materialPlane = new THREE.MeshStandardMaterial({ color: "orange" });
        materialP.wireframe = true;    //线框模式
        material.fog = true; //雾化
        const cube = new THREE.Mesh(geometry, material); //创建物体 物体由材质与几何体组成
        const cubeP = new THREE.Mesh(geometry, materialP);
        const plane = new THREE.Mesh(planeGeometry, materialPlane);
        cubeP.add(cube); //将cube添加到cubeP
        cube.position.set(0, 2, 2);
        cubeP.position.set(0, 5, 2);
        cube.scale.set(2, 2, 2);
        plane.rotation.x = -Math.PI / 2;
        scene.add(cubeP);
        scene.add(plane);
        // 辅助坐标轴
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        // 网格辅助器
        const size = 1000; // 网格的大小
        const divisions = 100; // 网格的分割数
        const gridHelper = new THREE.GridHelper(size, divisions);
        gridHelper.position.y = -1;
        scene.add(gridHelper);
        // 环境光
        const ambientLight = new THREE.AmbientLight(0x404040); // 环境光
        scene.add(ambientLight);
        // 平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        scene.fog = new THREE.Fog("#D3D3D3", 1, 100); //雾化
        scene.background = new THREE.Color("#D3D3D3");


        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
            format: THREE.RGBAFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter
        });
        // 创建立方体相机
        const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
        scene.add(cubeCamera);
        // 创建一个反射材质的球体
        const sphereMaterial = new THREE.MeshPhongMaterial({
            envMap: cubeRenderTarget.texture
        });
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 2, 0);
        scene.add(sphere);

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
        const dragControls = new DragControls([sphere], camera, renderer.domElement);

        // 禁用 OrbitControls 在拖拽时
        dragControls.addEventListener('dragstart', function (event) {
            controls.enabled = false;
        });

        dragControls.addEventListener('dragend', function (event) {
            controls.enabled = true;
        });

        //添加阴影
        plane.receiveShadow = true;
        directionalLight.castShadow = true;
        cubeP.castShadow = true;
        cube.castShadow = true;
        renderer.shadowMap.enabled = true;
        // directionalLight.shadow.radius = 4;
        // 设置阴影相机的近远剪切面
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 1000;
        // 调整阴影相机的视锥体范围：
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;

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
        gui.addColor(material, "color").name("cube_color");
        const cubePFolder = gui.addFolder("cubeP");
        cubePFolder.add(materialP, "wireframe").name("wireframe");
        const cameraFolder = gui.addFolder("camera");
        cameraFolder.add(camera, "fov", 0, 180).name("fov").onChange(() => camera.updateProjectionMatrix()); //部分属性需要手动更新
        cameraFolder.add(camera, "aspect", 0, 4).name("aspect").onChange(() => camera.updateProjectionMatrix());
        cameraFolder.add(camera, "near", 0, 10).name("near").onChange(() => camera.updateProjectionMatrix());
        cameraFolder.add(camera, "far", 0, 2000).name("far").onChange(() => camera.updateProjectionMatrix());
        cameraFolder.add(camera.position, 'x', -10, 10);

        // 渲染
        let animationId: number;
        function animate() {
            controls.update();
            animationId = requestAnimationFrame(animate);
            // cubeP.rotation.x += 0.01;
            // cubeP.rotation.y += 0.01;

            // 更新立方体相机位置
            cubeCamera.position.copy(sphere.position);
            // 更新立方体相机
            sphere.visible = false; // 隐藏球体以避免自我反射
            cubeCamera.update(renderer, scene);
            sphere.visible = true; // 恢复球体可见性
            renderer.render(scene, camera);
        }
        animate();
        return () => {
            console.log("unmount");
            window.removeEventListener("resize", onResize);
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
        <div id="Demo" className={classes.Container} />
    );
};

export default Demo;