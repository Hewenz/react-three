import * as THREE from 'three';
class Camera {
    constructor() {
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        return camera;
    }
}

class Scene {
    constructor() {
        const scene = new THREE.Scene();
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        return scene;
    }
}

class Renderer {
    constructor() {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        return renderer;
    }
}

class TestImportModel {
    constructor(scene, camera, renderer) {
        this.name = "TestImportModel"
        renderer.setAnimationLoop( animate );
        function animate() {
            renderer.render( scene, camera );
            scene.children[0].rotation.x += 0.01;
            scene.children[0].rotation.y += 0.01;
        }
        return this;
    }
}

export const createModal = () => {
    const scene = new Scene();
    const camera = new Camera();
    const renderer = new Renderer();
    return new TestImportModel(scene, camera, renderer);
}