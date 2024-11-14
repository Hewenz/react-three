import React, { useEffect } from "react";
import { createModal } from "../../three/blender";


const Blender = () => {
    useEffect(() => {
        // createModal();
        // 获取canvas元素和上下文
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');

        // 定义起点和终点坐标
        var startX = 50;
        var startY = 50;
        var endX = 200;
        var endY = 200;

        // 定义控制点坐标
        var cp1x = startX;
        var cp1y = startY + (endY - startY) / 2;
        var cp2x = endX;
        var cp2y = endY - (endY - startY) / 2;

        // 开始绘制曲线
        context.beginPath();
        context.moveTo(startX, startY);
        context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        context.stroke();
    }, []);
    return (
        <div id="blender">
            <canvas id="myCanvas" width="300" height="300" style={{ border: '1px solid #000' }}></canvas>
        </div>
    );
};

export default Blender;