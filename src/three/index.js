import * as THREE from 'three';

/**
 *  @param scene string The scene
 *  @param camera  string The camera
 */
export const createRender =()=>{
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.pixelRatio = window.devicePixelRatio;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.append(renderer.domElement);
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

export const createScene =()=>{
    const scene = new THREE.Scene();
    return scene
}

export const createAxis =(scene)=>{
    const axis = new THREE.AxesHelper(5);
    scene.add(axis);
    return axis
}

export const createCube=(scene)=>{
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    cube.rotation.y = Math.PI / 4;
    scene.add(cube);
    return cube
}

export function animate(scene,camera,renderer,cube) {
    requestAnimationFrame(()=> animate(scene,camera,renderer,cube) );
    cube.rotation.y += 0.01;
    renderer.render( scene, camera );
}

