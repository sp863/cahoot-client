import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import styled from "styled-components";
import { getDocumentForm } from "../api/docApi";
import useFormMutation from "../hooks/doc-mutation-hook";
import DrawCanvas from "./DrawCanvas";
import SignatureCanvas from "./SignatureCanvas";

const DigitalSignature = ({ auth, fetchApiPrivate, completeStep }) => {
  const contextRef = useRef();
  const canvasRef = useRef();
  const [canvasContext, setCanvasContext] = useState([]);

  const [pageNumber, setPageNumber] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState("");
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const [mainCanvasImageWidth, setMainCanvasImageWidth] = useState(0);
  const [mainCanvasImageHeight, setMainCanvasImageHeight] = useState(0);
  const [mainCanvasOffest, setMainCanvasOffset] = useState({ left: 0, top: 0 });
  const [editBoxes, setEditBoxes] = useState([]);

  const [isAgreed, setIsAgreed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isRectDrawn, setIsRectDrawn] = useState(false);

  const { form_id } = useParams();
  const { data: docForm } = useQuery(["form", form_id], () =>
    getDocumentForm(fetchApiPrivate, form_id)
  );
  const { signFormMutation } = useFormMutation();

  console.log(editBoxes);

  useEffect(() => {
    if (!docForm?.data.imageUrls.length) return;

    setPagesCount(docForm?.data.imageUrls.length);
    setCurrentPage(docForm?.data.imageUrls[pageNumber]);
  }, [docForm, pageNumber]);

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "blue";
    context.lineWidth = 3;
    contextRef.current = context;

    setCanvasContext(contextRef.current);
  }, []);

  const changePageHandler = (event) => {
    if (event.target.id === "next") {
      setPageNumber((previous) => previous + 1);
      return;
    }

    setPageNumber((previous) => previous - 1);
  };

  const canvasMouseDownHandler = ({ nativeEvent }) => {
    if (!isDrawingMode || !isRectDrawn) return;

    const { offsetX, offsetY } = nativeEvent;

    canvasContext.beginPath();
    canvasContext.moveTo(offsetX, offsetY);
    setIsSigning(true);
  };

  const canvasMouseMoveHandler = ({ nativeEvent }) => {
    if (!isSigning) return;

    const { offsetX, offsetY } = nativeEvent;
    canvasContext.lineTo(offsetX, offsetY);
    canvasContext.stroke();
  };

  const canvasMouseUpHandler = () => {
    canvasContext.closePath();
    setIsSigning(false);
  };

  const clearSignCanvasHandler = () => {
    canvasContext.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  const signatureInsertHandler = (event) => {
    if (!isRectDrawn || !editBoxes.length || !isDrawingMode) return;

    setEditBoxes((previous) => {
      const lastBox = previous[previous.length - 1];
      lastBox.type = "image";
      lastBox.content = canvasRef.current.toDataURL();
      lastBox.pageNumber = pageNumber;

      return [...previous];
    });

    setIsRectDrawn(false);
    setIsDrawingMode(false);
  };

  const submitSignatureHandler = (event) => {
    console.log(auth.auth.user.email);
    signFormMutation.mutate(
      fetchApiPrivate,
      form_id,
      editBoxes,
      auth.auth.user.email
    );
  };

  return (
    <StepContainer>
      <FormContainer>
        <ControlPanel>
          <button
            id="previous"
            disabled={pageNumber <= 0}
            onClick={changePageHandler}
          >
            {"<"}
          </button>
          <button
            id="next"
            disabled={pageNumber === pagesCount - 1}
            onClick={changePageHandler}
          >
            {">"}
          </button>
          <button
            disabled={isDrawingMode}
            onClick={() => setIsDrawingMode(true)}
          >
            Sign Mode
          </button>
          <button
            disabled={!isDrawingMode}
            onClick={() => setIsDrawingMode(false)}
          >
            Cancel
          </button>
        </ControlPanel>
        <CanvasContainer>
          <SignatureCanvas
            formImage={currentPage}
            isDrawing={isDrawingMode}
            updateWidth={setMainCanvasImageWidth}
            updateHeight={setMainCanvasImageHeight}
            updateOffset={setMainCanvasOffset}
            pageNumber={pageNumber}
            edits={editBoxes}
            deleteEmptyEdits={setEditBoxes}
          />
          <DrawCanvas
            formImage={currentPage}
            isDrawingMode={isDrawingMode}
            imageHeight={mainCanvasImageHeight}
            pageNumber={pageNumber}
            addEdit={setEditBoxes}
            rectDrawn={setIsRectDrawn}
          />
        </CanvasContainer>
      </FormContainer>
      <InputPanel>
        <Editor>
          <EditorNav>
            <SignTab>Signature</SignTab>
          </EditorNav>
          <CanvasInput>
            <Canvas
              ref={canvasRef}
              onMouseDown={canvasMouseDownHandler}
              onMouseMove={canvasMouseMoveHandler}
              onMouseUp={canvasMouseUpHandler}
              disabled={!isDrawingMode || !isRectDrawn}
            />
            <CanvasControl>
              <button
                disabled={!isRectDrawn || !isDrawingMode}
                onClick={signatureInsertHandler}
              >
                Insert
              </button>
              <button
                disabled={!isRectDrawn || !isDrawingMode}
                onClick={clearSignCanvasHandler}
              >
                Clear
              </button>
            </CanvasControl>
          </CanvasInput>
          <div>
            <input
              id="terms"
              type="checkbox"
              onChange={() => setIsAgreed(true)}
            />
            <label htmlFor="terms">
              I agree to the terms and conditions of the agreement.
            </label>
          </div>
        </Editor>
        <button disabled={!isAgreed} onClick={submitSignatureHandler}>
          Sign
        </button>
      </InputPanel>
    </StepContainer>
  );
};

export default DigitalSignature;

const StepContainer = styled.div`
  width: 100%;
  height: 670px;
  display: grid;
  grid-template-columns: 70% 30%;
`;

const CanvasInput = styled.div`
  display: grid;
  grid-template-rows: 90% 10%;
`;

const FormContainer = styled.div`
  background-color: #212529;
  display: grid;
  grid-template-rows: 5% 95%;
`;

const CanvasContainer = styled.div`
  position: relative;
`;

const CanvasControl = styled.div`
  grid-template-columns: 1fr 1fr;
`;

const InputPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const Editor = styled.div`
  width: 90%;
  height: 30%;
  display: grid;
  grid-template-rows: 17% 83%;
`;

const EditorNav = styled.div`
  background: pink;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const SignTab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Canvas = styled.canvas`
  height: 100%;
  width: 100%;
  background-color: lightgrey;
`;

const ControlPanel = styled.div`
  background-color: #868e96;
`;
