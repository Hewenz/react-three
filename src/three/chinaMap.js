import * as THREE from 'three';
import {OrbitControls} from "three/addons";
import {
    CSS2DRenderer,
    CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";


const coordinateTransformation = (x, y) => {
    return (x1, y1) => {
        return [x1 - x, y1 - y]
    }
}

export class ChinaMap {
    name = "中国地图"
    data = {}
    axis = null
    map = null
    camera = null
    scene = null
    renderer = null
    labelRenderer = null

    constructor(data) {
        this.data = data
    }

    createRender() {
        // alpha 背景透明 antialias 抗锯齿
        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        renderer.pixelRatio = window.devicePixelRatio;
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.querySelector('.App').append(renderer.domElement);
        // 1. 渲染器能够渲染阴影效果
        renderer.shadowMap.enabled = true;
        this.renderer = renderer;


        const labelRenderer = new CSS2DRenderer();
        labelRenderer.domElement.style.position = "absolute";
        labelRenderer.domElement.style.top = "0px";
        labelRenderer.domElement.style.pointerEvents = "none";
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        document.querySelector(".App").append(labelRenderer.domElement);
        this.labelRenderer = labelRenderer;
    }

    createMap() {
        const map = new THREE.Object3D();
        const translate = coordinateTransformation(103.931804, 30.652329)
        const createMesh = (data, color, depth) => {
            const shape = new THREE.Shape(data.map(item=>new THREE.Vector2(...translate(...item))));

            //上下两种写法都可以
            // data.forEach((item, idx) => {
            //     const [x1, y1] = translate(...item)
            //     if (idx === 0) shape.moveTo(x1, y1);
            //     else shape.lineTo(x1, y1);
            // });

            const shapeGeometry = new THREE.ExtrudeGeometry(shape, {depth: depth, bevelEnabled: false});
            const shapematerial = new THREE.MeshStandardMaterial({
                color: color,
                transparent: true,
                emissive: 0x000000,
                roughness: 0.45,
                // metalness: 0.8,
                // side: THREE.DoubleSide
            });

            const mesh = new THREE.Mesh(shapeGeometry, shapematerial);
            return mesh;
        };
        //创建城市描边
        const createLine = (data, depth) => {
            const points = data.map(item=>new THREE.Vector2(...translate(...item)));

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const uplineMaterial = new THREE.LineBasicMaterial({color: 0xffffff});
            const downlineMaterial = new THREE.LineBasicMaterial({color: 0xffffff});

            const upLine = new THREE.Line(lineGeometry, uplineMaterial);
            const downLine = new THREE.Line(lineGeometry, downlineMaterial);
            downLine.position.z = -0.0001;
            upLine.position.z = depth + 0.0001;
            return [upLine, downLine];
        };

        const createLabel = (name, point, depth) => {
            const div = document.createElement("div");
            div.style.color = "#fff";
            div.style.fontSize = "12px";
            div.style.textShadow = "1px 1px 2px #047cd6";
            div.textContent = name;
            const label = new CSS2DObject(div);
            // label.scale.set(0.01, 0.01, 0.01);
            const [x1, y1] = translate(...point);
            label.position.set(x1, y1, depth+0.3);
            return label;
        };

        this.data.features.forEach(feature => {
            const unit = new THREE.Object3D();
            const {name, centroid, center,} = feature.properties;
            const {coordinates, type} = feature.geometry;
            const color = new THREE.Color(`hsl(${233},${Math.random() * 30 + 55}%,${Math.random() * 30 + 55}%)`).getHex();
            const depth = Math.random() * 0.3 + 0.3;

            const label = createLabel(name, centroid || center || [0, 0], depth)

            coordinates.forEach((coordinate) => {
                if (type === "MultiPolygon")  coordinate.forEach((item) => fn(item));
                if (type === "Polygon") fn(coordinate);

                function fn(coordinate) {
                    const mesh = createMesh(coordinate, color, depth);
                    const line = createLine(coordinate, depth)

                    mesh.userData = {name}
                    unit.add(mesh, ...line);
                }
            });
            map.add(unit, label)
        })
        this.map = map
        this.scene.add(this.map)
    }


    createCamera() {
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, -5, 6);
        this.camera = camera
    }

    createLight() {
        const ambientLight = new THREE.AmbientLight(0xd4e7fd, 4);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xd4e7fd, 1);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);


        // 2. 该方向会投射阴影效果
        directionalLight.castShadow = true;
    }

    createScene() {
        const scene = new THREE.Scene();
        this.scene = scene
    }

    createAxis = () => {
        const axis = new THREE.AxesHelper(5);
        this.scene.add(axis);
        this.axis = axis
    }

    createCube() {
        const geometry = new THREE.BoxGeometry(4, 4, 4);
        const material = new THREE.MeshStandardMaterial({color: 0xff0000});
        const cube = new THREE.Mesh(geometry, material);
        cube.rotation.y = Math.PI / 4;
        cube.castShadow = true;
        this.scene.add(cube);
    }

    createBGImage(){
        const imgs = new THREE.Group() // Group 基本等于 Object3D
        const bgTexture = (new THREE.TextureLoader()).load( './images/bg-texture.png' );
        bgTexture.colorSpace = THREE.SRGBColorSpace;

        //平面形状
        const geometry = new THREE.PlaneGeometry( 400,400 );
        const material = new THREE.MeshBasicMaterial( { map: bgTexture, depthWrite: false, transparent: true} );
        const plane = new THREE.Mesh( geometry, material );

        imgs.add(plane)
        this.scene.add(plane);
    }

    createControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.update();
        this.controls = controls
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
        this.controls.update();
    }

    start() {

        this.createScene()
        this.createCamera()
        this.createMap()
        this.createAxis()
        // this.createCube()
        this.createLight()
        this.createRender()
        this.createControls()
        this.animate()
        let intersect
        window.addEventListener("pointerdown", (event) => {
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.camera);

            const intersects = raycaster
                .intersectObjects(this.map.children)
                .filter((item) => item.object.type !== "Line");
            if(intersect)translucency(intersect,1)
            console.log(intersects?.[0]?.object?.userData?.name) //答应点击的城市名
            console.log(intersect)
            if (Array.isArray(intersects) && intersects.length > 0) {
                //数据有时会将一个市分为两个多边形a
                intersect = intersects[0].object.parent
                translucency(intersect,0.4)
            }
            function translucency(intersect,opacity){
                intersect.children.forEach(item => {
                    if (item.type === "Mesh")
                        //设置透明需要将材质的transparent属性设置为true，
                        //这里在初始化材质（material）时已经设置，也可以在这里一起设置
                        item.material.opacity = opacity
                })
            }
        })
        // this.createMap()
    }

}
