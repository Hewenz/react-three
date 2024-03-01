
import './App.css';
// import {createThree} from "./three";
import { useEffect } from 'react';
import {ChinaMap} from "./three/chinaMap";

function App() {
    // createThree()

    useEffect(() => {
        let map 
        fetch("/sichuan.json").then(res=>res.json()).then((res)=>{
            map = new ChinaMap(res);
            map.start()

        })
        return () => {
            map.dispose()
            map = null
        };
    }, []);

    return (
        <div className="App">
        </div>
    );
}

export default App;
