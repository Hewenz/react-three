
import './App.css';
import {createRender,createScene,createAxis,createCamera,createCube,animate} from './three/index'
function App() {

    const createThree=()=>{
        const scene = createScene()
        const camera = createCamera()
        createAxis(scene)
        const cube = createCube(scene)
        const render =  createRender(scene,camera)
        animate(scene,camera,render,cube)
    }

    createThree()
    return (
        <div className="App">
        </div>
    );
}

export default App;
