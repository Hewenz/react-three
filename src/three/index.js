import * as THREE from 'three';
import {OrbitControls} from "three/addons";


const clock = new THREE.Clock();
export const createRender =()=>{
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.pixelRatio = window.devicePixelRatio;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.append(renderer.domElement);


    // 1. 渲染器能够渲染阴影效果
    renderer.shadowMap.enabled = true;
    return renderer
}

export const createCamera =()=>{
     const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(5, 5, 20);
    return camera
}


/**
 * @description 创建场景
 * @returns {Scene}
 */
export const createScene =()=>{
    const scene = new THREE.Scene();
    return scene
}


/**
 * @description 创建坐标系
 * @param scene
 * @returns {AxesHelper}
 */
export const createAxis =(scene)=>{
    const axis = new THREE.AxesHelper(5);
    scene.add(axis);
    return axis
}


/**
 * @description 创建四边形
 * @param scene
 * @returns {Mesh}
 */
export const createCube=(scene)=>{
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    cube.rotation.y = Math.PI / 4;
    cube.castShadow = true;
    scene.add(cube);
    return cube
}


export  const createPlane=(scene)=>{
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeGeometry2 = new THREE.PlaneGeometry(20, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x000000,
        roughness: 0.45,
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    const planeMesh2 = new THREE.Mesh(planeGeometry2, planeMaterial);
    const planeMesh3 = new THREE.Mesh(planeGeometry2, planeMaterial);
    planeMesh.rotation.x = -0.5 * Math.PI;
    planeMesh3.rotation.y = 0.5 * Math.PI;
    planeMesh.position.set(0, -5, 0);
    planeMesh2.position.set(0, 0, -10);
    planeMesh3.position.set(-10, 0, 0);
    planeMesh.receiveShadow = true;
    planeMesh2.receiveShadow = true;
    planeMesh3.receiveShadow = true;
    scene.add(planeMesh);
    scene.add(planeMesh2);
    scene.add(planeMesh3);
}

export const createLight=(scene)=>{
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);


    // 2. 该方向会投射阴影效果
    directionalLight.castShadow = true;
}


export  const createControls = (camera,renderer)=>{
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    return controls
}


export function animate(scene,camera,renderer,controls,cube) {
    requestAnimationFrame(()=> animate(scene,camera,renderer,controls,cube) );
    const elapsedTime = clock.getElapsedTime();
    cube.rotation.y = elapsedTime * Math.PI; // 两秒自转一圈
    renderer.render( scene, camera );

    // 创建一个轨道控制器

    controls.update();
}

export const createThree=()=>{
    const scene = createScene()
    const camera = createCamera()
    createAxis(scene)
    createPlane(scene)
    const cube = createCube(scene)
    createLight (scene)
    const render =  createRender(scene,camera)
    const controls =  createControls(camera,render)
    animate(scene,camera,render,controls,cube)
}
