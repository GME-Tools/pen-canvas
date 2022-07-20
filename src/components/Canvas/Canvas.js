import React, { useRef, useEffect } from 'react';
import "./Canvas.css";

const Canvas = props => {
    
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        //context.fillStyle = "#0000FF";
        //context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }, []);

    return <canvas className="canvasArea" ref={canvasRef} {...props} />
}

export default Canvas;
