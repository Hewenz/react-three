import React, { useEffect } from "react";
import { createModal } from "../../three/blender";


const Blender = () => {
    useEffect(() => {
        createModal();
    }, []);
    return (
        <div id="blender">
        </div>
    );
};

export default Blender;