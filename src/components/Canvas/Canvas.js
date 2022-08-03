import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from "context/FirebaseContext";
import { Card } from '@mui/material';
import SketchCanvas from 'components/SketchCanvas/SketchCanvas';
import "./Canvas.css";

export default function Canvas() {
  const canvasRef = useRef();
  const firebase = useFirebase();
  const { id, token } = useParams();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    firebase.getDocument("canvas",id).then(doc => {
        //console.log(doc.data().paths);
        canvasRef.current?.loadPaths(doc.data().paths)
    });
    if (token) {
      firebase.getDocument("users",token).then(doc => {
        setIsAuth(doc.data().canvas.includes(id));
      })
    }
    else {
      setIsAuth(false);
    }
  },[firebase,id,token])

  useEffect(() => {
    const interval = setInterval(() => {
      firebase.setDocument("canvas",id,{paths:paths});
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = () => {
    canvasRef.current?.exportPaths().then(data => {
      setPaths(data);
    }
  }

  return (
    <div className="canvasContainer">
      <SketchCanvas
        ref={canvasRef}
        className="canvasArea"
        strokeWidth={4}
        strokeColor="red"
        onStroke={handleChange}
        allowOnlyPointerType="pen"
        editable={isAuth}
      />
      <Card className="toolbar"></Card>
    </div>
  )
}
