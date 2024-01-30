
import './App.css';
import {
    createRender,
    createScene,
    createAxis,
    createCamera,
    createCube,
    animate,
    createControls,
    createLight, createPlane
} from './three/index'
function App() {

    const createThree=()=>{
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

    createThree()
    return (
        <div className="App">
        </div>
    );
}

export default App;
