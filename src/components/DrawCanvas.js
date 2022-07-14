import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const DrawCanvas = ({
  formImage,
  isDrawingMode,
  imageHeight,
  pageNumber,
  addEdit,
  rectDrawn,
}) => {
  const contextRef = useRef();
  const canvasRef = useRef();
  const [canvasContext, setCanvasContext] = useState(null);
  const [mouseDownCoords, setMouseDownCoords] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectSize, setRectSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!formImage) return;

    const context = canvasRef.current.getContext("2d");
    contextRef.current = context;

    canvasRef.current.width = 969.3;
    canvasRef.current.height = 650;

    setCanvasContext(contextRef.current);
  }, [formImage]);

  useEffect(() => {
    if (!canvasContext) return;

    canvasContext.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  }, [isDrawingMode]);

  const canvasMouseDownHandler = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;

    canvasContext.lineCap = "round";
    canvasContext.strokeStyle = "red";
    canvasContext.lineWidth = 3;

    canvasContext.beginPath();
    canvasContext.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setMouseDownCoords({ x: offsetX, y: offsetY });
  };

  const canvasMouseMoveHandler = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;

    const width = offsetX - mouseDownCoords.x;
    const height = offsetY - mouseDownCoords.y;

    canvasContext.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    canvasContext.strokeRect(
      mouseDownCoords.x,
      mouseDownCoords.y,
      width,
      height
    );
    setRectSize({ width, height });
  };

  const canvasMouseUpHandler = () => {
    canvasContext.closePath();

    const scale = 650 / imageHeight;

    addEdit((previous) => [
      ...previous,
      {
        x: mouseDownCoords.x,
        y: mouseDownCoords.y,
        width: rectSize.width * scale,
        height: rectSize.height * scale,
        fontSize: rectSize.width * scale,
        pageNumber,
      },
    ]);
    rectDrawn(true);
    setIsDrawing(false);
  };

  return (
    <Canvas
      ref={canvasRef}
      onMouseDown={canvasMouseDownHandler}
      onMouseMove={canvasMouseMoveHandler}
      onMouseUp={canvasMouseUpHandler}
      isDrawing={isDrawingMode}
    />
  );
};

export default DrawCanvas;

const Canvas = styled.canvas`
  overflow-y: scroll;
  position: absolute;
  left: 0;
  top: 0;
  z-index: ${(props) => (props.isDrawingMode ? 10 : 0)};
`;
