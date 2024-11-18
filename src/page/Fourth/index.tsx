import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import TWEEN from "@tweenjs/tween.js";

const useStyles = makeStyles({
    Container: {
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
    },
});

type SphereMesh = THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap> & { _color: number }
const getCamera = (box: Element): THREE.PerspectiveCamera => {
    const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    return camera;
};

const useSimpleThree = () => {
    const [box, setBox] = useState<Element | null>(null);
    const [scene, setScene] = useState<THREE.Scene>();
    const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
    useEffect(() => {
        if (!box || !scene || !camera) return;
        const axesHelper = new THREE.AxesHelper(5);
        // 场景与物品
        scene.add(axesHelper);
        //渲染器
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(box.clientWidth, box.clientHeight);
        box.appendChild(renderer.domElement);


        const controls = new OrbitControls(camera, renderer.domElement);

        function animate() {
            controls.update();
            TWEEN.update();
            requestAnimationFrame(animate);
            if (!scene || !camera) return;
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
    }, [box, scene, camera]);
    class Simple {
        setBox(box: Element | null) {
            setBox(box);
        }
        setScene(scene: THREE.Scene) {
            setScene(scene);
        }
        setCamera(camera: THREE.PerspectiveCamera) {
            setCamera(camera);
        }
    }
    return new Simple();
};

const Fourth = () => {
    const classes = useStyles();
    const simple = useSimpleThree();
    useEffect(() => {

        const box = document.getElementById("fourth");
        console.log("fourth", box);
        if (!box) return;
        const camera = getCamera(box);
        // 场景与物品
        const scene = new THREE.Scene();
        const geometry = new THREE.SphereGeometry(1, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const material2 = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        const material3 = new THREE.MeshBasicMaterial({ color: 0x00ffff });

        const sphere = new THREE.Mesh(geometry, material);
        const sphere2 = new THREE.Mesh(geometry, material2);
        const sphere3 = new THREE.Mesh(geometry, material3);
        sphere.position.set(-4, 0, 0);
        sphere2.position.set(0, 0, 0);
        sphere3.position.set(4, 0, 0);
        scene.add(sphere);
        scene.add(sphere2);
        scene.add(sphere3);

        simple.setBox(box);
        simple.setScene(scene);
        simple.setCamera(camera);


        //摄像机类比现实中的的相机，其镜头应该是一个弧面
        //射线是 用户鼠标点击坐标映射到从摄像机的镜头弧面上的坐标的法线，法线是垂直于该弧面坐标切平面的向量
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        


        const handleClick = (event: any) => {
            // 坐标归一化
            mouse.x = ((event.clientX - 260) / box.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / box.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera); // 通过摄像机和鼠标位置更新射线
            const intersects = raycaster.intersectObjects([sphere, sphere2, sphere3]);  //射线与物体的相交情况
            if (intersects.length > 0) {
                const sphereObject = intersects[0].object as SphereMesh;
                const tween = new TWEEN.Tween(sphereObject.position)
                tween.to({ y: 4 }, 2000).repeat().yoyo(true).start();

                if (!(sphereObject as SphereMesh)._color) {
                    (sphereObject as SphereMesh)._color = (sphereObject as SphereMesh).material.color.getHex();
                    (sphereObject as SphereMesh).material.color.set(0xff0000);
                } else {
                    (sphereObject as SphereMesh).material.color.set((sphereObject as SphereMesh)._color);
                    (sphereObject as SphereMesh)._color = 0;
                }

            }
            console.log(intersects);
        };
        box?.addEventListener("click", handleClick);
        return () => {
            box?.removeEventListener("click", handleClick);
        };
    }, []);

    // 同过
    return (
        <div id="fourth" className={classes.Container} />
    );
};

export default Fourth;