import { useRef, useState, useEffect, useCallback } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import DrawArea from 'components/SketchCanvas/DrawArea';

const SketchCanvas = forwardRef((props, ref) => {
  const {
    id = 'sketch-canvas',
    width = '100%',
    height = '100%',
    className = '',
    canvasColor = 'white',
    strokeColor = 'red',
    backgroundImage = '',
    exportWithBackgroundImage = false,
    preserveBackgroundImageAspectRatio = 'none',
    strokeWidth = 4,
    eraserWidth = 8,
    allowOnlyPointerType = 'all',
    style = {
      border: '0.0625rem solid #9c9c9c',
      borderRadius: '0.25rem',
    },
    svgStyle = {},
    onChange = (_paths) => {},
    onStroke = (_path, _isEraser) => {},
    withTimestamp = false,
  } = props;

  const svgCanvas = useRef();
  const [drawMode, setDrawMode] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [resetStack, setResetStack] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [currentPaths, setCurrentPaths] = useState([]);

  const liftStrokeUp = useCallback(() => {
    const lastStroke = currentPaths.slice(-1)?.[0] ?? null;
    if (lastStroke === null) {
      console.warn('No stroke found!');
      return;
    }
    onStroke(lastStroke, !lastStroke.drawMode);
  }, [currentPaths,onStroke]);

  useEffect(() => {
    liftStrokeUp();
  }, [liftStrokeUp]);

  useEffect(() => {
    onChange(currentPaths);
  }, [currentPaths,onChange]);

  useImperativeHandle(ref, () => ({
    eraseMode: (erase) => {
      setDrawMode(!erase);
    },
    clearCanvas: () => {
      setResetStack([...currentPaths]);
      setCurrentPaths([]);
    },
    undo: () => {
      // If there was a last reset then
      if (resetStack.length !== 0) {
        setCurrentPaths([...resetStack]);
        setResetStack([]);
        return;
      }
      setUndoStack((undoStack) => [...undoStack, ...currentPaths.slice(-1)]);
      setCurrentPaths((currentPaths) => currentPaths.slice(0, -1));
    },
    redo: () => {
      // Nothing to Redo
      if (undoStack.length === 0) return;
      setCurrentPaths((currentPaths) => [
        ...currentPaths,
        ...undoStack.slice(-1),
      ]);
      setUndoStack((undoStack) => undoStack.slice(0, -1));
    },
    exportImage: (imageType) => {
      const exportImage = svgCanvas.current?.exportImage;
      if (!exportImage) {
        throw Error('Export function called before canvas loaded');
      } else {
        return exportImage(imageType);
      }
    },
    exportSvg: () => {
      return new Promise((resolve, reject) => {
        const exportSvg = svgCanvas.current?.exportSvg;
        if (!exportSvg) {
          reject(Error('Export function called before canvas loaded'));
        } else {
          exportSvg()
            .then((data) => {
              resolve(data);
            })
            .catch((e) => {
              reject(e);
            });
        }
      });
    },
    exportPaths: () => {
      return new Promise((resolve, reject) => {
        try {
          resolve(currentPaths);
        } catch (e) {
          reject(e);
        }
      });
    },
    loadPaths: (paths) => {
      setCurrentPaths((currentPaths) => [...currentPaths, ...paths]);
    },
    getSketchingTime: () => {
      return new Promise((resolve, reject) => {
        if (!withTimestamp) {
          reject(new Error("Set 'withTimestamp' prop to get sketching time"));
        }
        try {
          const sketchingTime = currentPaths.reduce(
            (totalSketchingTime, path) => {
              const startTimestamp = path.startTimestamp ?? 0;
              const endTimestamp = path.endTimestamp ?? 0;
              return totalSketchingTime + (endTimestamp - startTimestamp);
            },
            0
          );
          resolve(sketchingTime);
        } catch (e) {
          reject(e);
        }
      });
    },
    resetCanvas: () => {
      setResetStack([]);
      setUndoStack([]);
      setCurrentPaths([]);
    },
  }));

  const handlePointerDown = (point) => {
    setIsDrawing(true);
    setUndoStack([]);

    let stroke = {
      drawMode: drawMode,
      strokeColor: drawMode ? strokeColor : '#000000', // Eraser using mask
      strokeWidth: drawMode ? strokeWidth : eraserWidth,
      paths: [point],
    };

    if (withTimestamp) {
      stroke = {
        ...stroke,
        startTimestamp: Date.now(),
        endTimestamp: 0,
      };
    }

    setCurrentPaths((currentPaths) => [...currentPaths, stroke]);
  };

  const handlePointerMove = (point) => {
    if (!isDrawing) return;
    const currentStroke = currentPaths.slice(-1)[0];
    const updatedStroke = {
      ...currentStroke,
      paths: [...currentStroke.paths, point],
    };
    setCurrentPaths((currentPaths) => [
      ...currentPaths.slice(0, -1),
      updatedStroke,
    ]);
  };

  const handlePointerUp = () => {
    if (!isDrawing) {
      return;
    }
    setIsDrawing(false);
    if (!withTimestamp) {
      return;
    }
    let currentStroke = currentPaths.slice(-1)?.[0] ?? null;
    if (currentStroke === null) {
      return;
    }

    const updatedStroke = {
      ...currentStroke,
      endTimestamp: Date.now(),
    };

    setCurrentPaths((currentPaths) => [
      ...currentPaths.slice(0, -1),
      updatedStroke,
    ]);
  };

  return (
    <DrawArea
      ref={svgCanvas}
      id={id}
      width={width}
      height={height}
      className={className}
      canvasColor={canvasColor}
      backgroundImage={backgroundImage}
      exportWithBackgroundImage={exportWithBackgroundImage}
      preserveBackgroundImageAspectRatio={preserveBackgroundImageAspectRatio}
      allowOnlyPointerType={allowOnlyPointerType}
      style={style}
      svgStyle={svgStyle}
      paths={currentPaths}
      isDrawing={isDrawing}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  );
});

export default SketchCanvas;