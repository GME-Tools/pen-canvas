import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from "context/FirebaseContext";
import { Card } from '@mui/material';
import SketchCanvas from 'components/SketchCanvas/SketchCanvas';
import "./Canvas.css";

export default function Canvas() {
  const firebase = useFirebase();
  const [paths, setPaths] = useState([]);
  const { id, token } = useParams();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    firebase.getDocument("canvas",id).then(doc => setPaths(doc.data().paths));
    if (token) {
      firebase.getDocument("users",token).then(doc => {
        setIsAuth(doc.data().canvas.includes(id));
      })
    }
    else {
      setIsAuth(false);
    }
  },[firebase,id,token])

  const handleChange = (data) => {
    firebase.setDocument("canvas",id,{paths:data});
  }

  return (
    <div className="canvasContainer">
      <SketchCanvas
        className="canvasArea"
        strokeWidth={4}
        strokeColor="red"
        onChange={handleChange}
        paths={paths}
        editable={isAuth}
      />
      <Card className="toolbar"></Card>
    </div>
  )
}
