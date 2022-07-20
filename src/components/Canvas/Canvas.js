import React from 'react';
import { Card } from '@mui/material';
import SketchCanvas from 'components/SketchCanvas/SketchCanvas';
import "./Canvas.css";

export default function Canvas() {
  return (
    <div className="canvasContainer">
      <SketchCanvas
        className="canvasArea"
        strokeWidth={4}
        strokeColor="red"
      />
      <Card className="toolbar"></Card>
    </div>
  )
}
