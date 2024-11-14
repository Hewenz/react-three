import React, { useEffect } from "react";
import { makeStyles } from "@fluentui/react-components";
import * as THREE from "three";

const useStyles = makeStyles({
    Container: {
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
    },
});
const First = () => {
    const classes = useStyles();
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
    }, []);
    return (
        <div id="first" className={classes.Container}>
            <h1>First Page</h1>
        </div>
    );
};

export default First;