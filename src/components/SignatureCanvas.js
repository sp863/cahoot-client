import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  convertToCanvasCoordinates,
  drawEdits,
  moveDrawnEdits,
  initEditOffsets,
  initEditSizes,
  zoomDrawnEdits,
} from "../utils/signatureUtils";

const SignatureCanvas = ({
  formImage,
  isDrawing,
  updateWidth,
  updateHeight,
  updateOffset,
  pageNumber,
  edits,
  deleteEmptyEdits,
}) => {
  const contextRef = useRef();
  const canvasRef = useRef();
  const [canvasContext, setCanvasContext] = useState([]);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [zoomRate, setZoomRate] = useState(0);

  const [imageElement, setImageElement] = useState(new Image());
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseDownCoords, setMouseDownCoords] = useState({ x: 0, y: 0 });
  const [offsetDistance, setOffsetDistance] = useState({ left: 0, top: 0 });
  const [editOffsets, setEditOffsets] = useState([]);
  const [editSizes, setEditSizes] = useState([]);

  useEffect(() => {
    if (!formImage) return;

    const context = canvasRef.current.getContext("2d");
    contextRef.current = context;

    setCanvasContext(contextRef.current);

    const image = new Image();
    image.src = formImage;

    image.onload = () => {
      const scaleFactor = 650 / image.height;
      const resizedImageHeight = image.height * scaleFactor;
      const resizedImageWidth = image.width * scaleFactor;
      setImageWidth(resizedImageWidth);
      setImageHeight(resizedImageHeight);
      updateWidth(resizedImageWidth);
      updateHeight(resizedImageHeight);

      canvasRef.current.width = 969.3;
      canvasRef.current.height = 650;

      const imagePositionX =
        canvasRef.current.width / 2 - resizedImageWidth / 2;

      const offsetX = parseInt(`${imagePositionX}`, 10);

      context.drawImage(
        image,
        offsetX,
        0,
        resizedImageWidth,
        resizedImageHeight
      );
      setOffsetDistance({ left: offsetX, top: 0 });
      updateOffset({ left: offsetX, top: 0 });
      setImageElement(image);
    };
  }, [formImage]);

  useEffect(() => {
    if (isDrawing || !edits.length) return;

    const scale = imageHeight / 650;

    drawEdits(canvasContext, edits, scale, pageNumber);
    deleteEmptyEdits((edits) => {
      return edits.filter((edit) => edit.content || edit?.x);
    });
    initEditOffsets(edits, setEditOffsets, pageNumber);
    initEditSizes(edits, setEditSizes, pageNumber);
  }, [isDrawing]);

  const canvasMouseDownHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const { clientX, clientY } = event;
    const coordinates = convertToCanvasCoordinates(
      canvasRef.current,
      clientX,
      clientY
    );
    canvasRef.current.style.cursor = "move";
    setIsMouseDown(true);
    setMouseDownCoords({ x: coordinates.x, y: coordinates.y });
  };

  const canvasMouseMoveHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (!isMouseDown) return;

    const { clientX, clientY } = event;
    const coordinates = convertToCanvasCoordinates(
      canvasRef.current,
      clientX,
      clientY
    );

    const moveDistanceX = coordinates.x - mouseDownCoords.x;
    const moveDistanceY = coordinates.y - mouseDownCoords.y;

    if (moveDistanceX === 0 && moveDistanceY === 0) return;

    const offsetX = parseInt(`${moveDistanceX + offsetDistance.left}`, 10);
    const offsetY = parseInt(`${moveDistanceY + offsetDistance.top}`, 10);

    canvasContext.clearRect(0, 0, imageWidth, imageHeight);
    canvasRef.current.width = 969.3;
    canvasRef.current.height = 650;
    const scale = imageHeight / 650;

    canvasContext.drawImage(
      imageElement,
      offsetX,
      offsetY,
      imageWidth,
      imageHeight
    );

    moveDrawnEdits(
      canvasContext,
      edits,
      editOffsets,
      pageNumber,
      moveDistanceX,
      moveDistanceY,
      scale
    );

    setMouseDownCoords({
      x: coordinates.x,
      y: coordinates.y,
    });
    setOffsetDistance({
      left: offsetX,
      top: offsetY,
    });
    updateOffset({
      left: offsetX,
      top: offsetY,
    });
    setEditOffsets((previous) =>
      previous.map((offset) => {
        return {
          ...offset,
          x: offset.x + moveDistanceX,
          y: offset.y + moveDistanceY,
        };
      })
    );
  };

  const canvasMouseUpHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();
    canvasRef.current.style.cursor = "default";
    setIsMouseDown(false);
  };

  const canvasScrollHandler = (event) => {
    event.stopPropagation();

    const scrollDirection = event.deltaY > 0 ? 1 : -1;
    const zoomInScale = 1.2;
    const zoomOutScale = 0.8;
    const rate = scrollDirection > 0 ? zoomInScale : zoomOutScale;
    setZoomRate(rate);

    const width = imageWidth * rate;
    const height = imageHeight * rate;

    canvasContext.clearRect(0, 0, imageWidth, imageHeight);
    canvasRef.current.width = 969.3;
    canvasRef.current.height = 650;

    canvasContext.drawImage(
      imageElement,
      offsetDistance.left,
      offsetDistance.top,
      width,
      height
    );

    zoomDrawnEdits(
      canvasContext,
      edits,
      editSizes,
      editOffsets,
      pageNumber,
      rate
    );
    setImageWidth(width);
    setImageHeight(height);
    updateWidth(width);
    updateHeight(height);
    setEditSizes((previous) =>
      previous.map((size) => {
        return {
          ...size,
          x: size.width * rate,
          y: size.height * rate,
        };
      })
    );
  };

  return (
    <Canvas
      ref={canvasRef}
      onMouseDown={canvasMouseDownHandler}
      onMouseMove={canvasMouseMoveHandler}
      onMouseUp={canvasMouseUpHandler}
      onWheel={canvasScrollHandler}
      isDrawing={isDrawing}
    />
  );
};

export default SignatureCanvas;

const Canvas = styled.canvas`
  overflow-y: scroll;
  position: absolute;
  left: 0;
  top: 0;
  z-index: ${(props) => (props.isDrawing ? 0 : 10)};
`;
