
import './App.css';
import {
    createThree
} from './three/index'
import {ChinaMap} from "./three/chinaMap";

function App() {
    // createThree()

    fetch("/sichuan.json").then(res=>res.json()).then((res)=>{
        const map = new ChinaMap(res);
        map.start()
    })

    return (
        <div className="App">
        </div>
    );
}

export default App;
