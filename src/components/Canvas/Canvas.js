import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from "context/FirebaseContext";
import { Card, IconButton, Slider } from '@mui/material';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import SketchCanvas from 'components/SketchCanvas/SketchCanvas';
import "./Canvas.css";

export default function Canvas() {
  const canvasRef = useRef();
  const firebase = useFirebase();
  const { id, token } = useParams();
  const [isAuth, setIsAuth] = useState(false);
  const [mustSave, setMustSave] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [size, setSize] = useState(4);

  useEffect(() => {
    firebase.getDocument("canvas",id).then(doc => {
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
      if (mustSave) {
        canvasRef.current?.exportPaths().then(paths => {
          firebase.setDocument("canvas",id,{paths:paths});
        })
        setMustSave(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [firebase,id,mustSave]);

  const handleStroke = () => {
    setMustSave(true);
  }

  return (
    <div className="canvasContainer">
      <SketchCanvas
        ref={canvasRef}
        className="canvasArea"
        strokeWidth={size}
        strokeColor="red"
        onStroke={handleStroke}
        allowOnlyPointerType="all"
        editable={isAuth}
      />
      <Card className="toolbar">
        <IconButton color="primary" onClick={() => setSizeOpen(o => (!o))}>
          <HorizontalRuleIcon />
        </IconButton>
      </Card>
      <Card className="sizetoolbar" sx={{display: {xs: sizeOpen?"block":"none"}}}>
        <Slider
          value={size}
          min={1}
          max={10}
          step={1}
          onChange={(event,val)=>setSize(val)}
        />
      </Card>
    </div>
  )
}
