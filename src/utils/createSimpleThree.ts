import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
        // TWEEN.update();
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

export default createSimpleThree;