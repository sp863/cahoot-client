export const convertToCanvasCoordinates = (canvas, x, y) => {
  const canvasBox = canvas.getBoundingClientRect();

  return {
    x: (x - canvasBox.left) * (canvas.width / canvasBox.width),
    y: (y - canvasBox.top) * (canvas.height / canvasBox.height),
  };
};

export const convertToImageCoordinates = (canvas, x, y, offsetX, offsetY) => {
  const canvasBox = canvas.getBoundingClientRect();

  return {
    x: (x - canvasBox.left - offsetX) * (canvas.width / canvasBox.width),
    y: (y - canvasBox.top - offsetY) * (canvas.height / canvasBox.height),
  };
};

export const initEditOffsets = (edits, setEditOffsets, pageNumber) => {
  edits.forEach((edit) => {
    if (edit.pageNumber === pageNumber && edit.content && edit.x) {
      const editOffset = { x: edit.x, y: edit.y };
      setEditOffsets((previous) => [...previous, editOffset]);
    }
  });
};

export const initEditSizes = (edits, setEditSizes, pageNumber) => {
  edits.forEach((edit) => {
    if (edit.pageNumber === pageNumber && edit.content && edit.width) {
      const editOffset = { width: edit.width, height: edit.height };
      setEditSizes((previous) => [...previous, editOffset]);
    }
  });
};

export const drawEdits = (canvasContext, edits, scale, pageNumber) => {
  edits.forEach((edit) => {
    if (edit.pageNumber === pageNumber && edit.content) {
      canvasContext.lineCap = "round";
      canvasContext.strokeStyle = "red";
      canvasContext.lineWidth = 2;

      canvasContext.strokeRect(
        edit.x,
        edit.y,
        edit.width * scale,
        edit.height * scale
      );

      if (edit.type === "text") {
        canvasContext.fillStyle = "blue";
        canvasContext.textAlign = "center";
        canvasContext.textBaseline = "middle";
        canvasContext.font = `${edit.fontSize / 3}px serif`;
        canvasContext.fillText(
          edit.content,
          edit.x + (edit.width * scale) / 2,
          edit.y + (edit.height * scale) / 2,
          edit.width
        );
      }

      if (edit.type === "image") {
        const image = new Image();
        image.src = edit.content;

        image.onload = () => {
          canvasContext.drawImage(
            image,
            edit.x,
            edit.y,
            edit.width * scale,
            edit.height * scale
          );
        };
      }
    }
  });
};

export const moveDrawnEdits = (
  canvasContext,
  edits,
  offsets,
  pageNumber,
  moveX,
  moveY,
  scale
) => {
  edits.forEach((edit, index) => {
    if (edit.pageNumber === pageNumber && edit.content) {
      canvasContext.lineCap = "round";
      canvasContext.strokeStyle = "red";
      canvasContext.lineWidth = 2;

      canvasContext.strokeRect(
        offsets[index].x + moveX,
        offsets[index].y + moveY,
        edit.width * scale,
        edit.height * scale
      );

      if (edit.type === "text") {
        canvasContext.fillStyle = "blue";
        canvasContext.textAlign = "center";
        canvasContext.textBaseline = "middle";
        canvasContext.font = `${edit.fontSize / 3}px serif`;
        canvasContext.fillText(
          edit.content,
          offsets[index].x + moveX + (edit.width * scale) / 2,
          offsets[index].y + moveY + (edit.height * scale) / 2,
          edit.width
        );
      }

      if (edit.type === "image") {
        const image = new Image();
        image.src = edit.content;

        image.onload = () => {
          canvasContext.drawImage(
            image,
            offsets[index].x + moveX,
            offsets[index].y + moveY,
            edit.width * scale,
            edit.height * scale
          );
        };
      }
    }
  });
};

export const zoomDrawnEdits = (
  canvasContext,
  edits,
  sizes,
  offsets,
  pageNumber,
  zoomRate
) => {
  edits.forEach((edit, index) => {
    if (edit.pageNumber === pageNumber && edit.content) {
      canvasContext.lineCap = "round";
      canvasContext.strokeStyle = "red";
      canvasContext.lineWidth = 2;

      canvasContext.strokeRect(
        offsets[index].x,
        offsets[index].y,
        sizes[index].width * zoomRate,
        sizes[index].height * zoomRate
      );

      if (edit.type === "text") {
        canvasContext.fillStyle = "blue";
        canvasContext.textAlign = "center";
        canvasContext.textBaseline = "middle";
        canvasContext.font = `${edit.fontSize / 3}px serif`;
        canvasContext.fillText(
          edit.content,
          offsets[index].x + (edit.width * zoomRate) / 2,
          offsets[index].y + (edit.height * zoomRate) / 2,
          edit.width * zoomRate
        );
      }

      if (edit.type === "image") {
        const image = new Image();
        image.src = edit.content;

        image.onload = () => {
          canvasContext.drawImage(
            image,
            offsets[index].x,
            offsets[index].y,
            sizes[index].width * zoomRate,
            sizes[index].height * zoomRate
          );
        };
      }
    }
  });
};
