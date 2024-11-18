import React, { useEffect, useState } from "react";
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

const useSimpleThree = (box: Element | null, scene?: THREE.Scene) => {
    useEffect(() => {
        if (!box || !scene) return;
        const axesHelper = new THREE.AxesHelper(5);
        // 场景与物品
        scene.add(axesHelper);

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
            if(!scene) return;
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
            box.removeChild(renderer.domElement);
            
            renderer.dispose();
            camera.clearViewOffset();
        };
    }, [box, scene]);
    return {};
};

const Second = () => {
    const classes = useStyles();
    const box = document.querySelector("#second");
    const [scene,setScene] = useState<THREE.Scene>();
    useSimpleThree(box, scene);
    useEffect(() => {

        // 场景与物品
        const scene = new THREE.Scene();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00,side: THREE.DoubleSide });
        const bufferGeometry = new THREE.BufferGeometry();
        const bufferGeometry2 = new THREE.BufferGeometry();

        // 通过顶点定位
        const vertices = new Float32Array([
            -1.0, -1.0, 1.0, // v0
            1.0, -1.0, 1.0, // v1
            1.0, 1.0, 1.0, // v2

            1.0, 1.0, 1.0, // v3
            -1.0, 1.0, 1.0, // v4
            -1.0, -1.0, 1.0  // v5
        ]);
        bufferGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3)); // BufferAttribute itemSize表示上一个参数是几维数据，在这里BufferAttribute是三位顶点坐标，所以itemSize为3    
        
        // 通过索引定位,合并顶点减少顶点数量
        const vertices2 = new Float32Array([
            -1.0, -1.0, 4.0, // v0
            1.0, -1.0, 4.0, // v1
            1.0, 1.0, 4.0, // v2 
            -1.0, 1.0, 4.0, // v3
        ]);
        const indices = new Uint16Array([
            0, 1, 2,
            2, 3, 0
        ]);
        bufferGeometry2.addGroup(0, 3, 0);
        bufferGeometry2.addGroup(3, 3, 1);
        bufferGeometry2.setAttribute('position', new THREE.BufferAttribute(vertices2, 3)); 
        bufferGeometry2.setIndex(new THREE.BufferAttribute(indices, 1));

        const noodle = new THREE.Mesh(bufferGeometry, material);
        const noodle2 = new THREE.Mesh(bufferGeometry2, [
            new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide }),
            new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
        ]);

        scene.add(noodle);
        scene.add(noodle2);

        setScene(scene);
    }, []);

    // 同过
    return (
        <div id="second" className={classes.Container} />
    );
};

export default Second;