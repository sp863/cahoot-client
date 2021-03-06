import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { getDocumentForm, signDocumentForm } from "../api/docApi";
import useFormMutation from "../hooks/doc-mutation-hook";
import DrawCanvas from "./DrawCanvas";
import SignatureCanvas from "./SignatureCanvas";

const DigitalSignature = ({ user, fetchApiPrivate }) => {
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
  const { project_id } = useParams();
  const navigate = useNavigate();
  const { data: docForm } = useQuery(["form", form_id], () =>
    getDocumentForm(fetchApiPrivate, form_id)
  );
  const { uploadFormImagesMutation } = useFormMutation();

  useEffect(() => {
    if (!docForm?.data.imageUrls.length) return;

    setPagesCount(docForm?.data.imageUrls.length);
    setCurrentPage(docForm?.data.imageUrls[pageNumber]);
  }, [docForm, pageNumber]);

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
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

    setEditBoxes((previous) =>
      previous.filter((edit) => edit.content || edit?.x)
    );

    setEditBoxes((previous) => {
      const lastBox = previous[previous.length - 1];
      lastBox.type = "image";
      lastBox.content = canvasRef.current.toDataURL();
      lastBox.pageNumber = pageNumber;
      lastBox.imageWidth = mainCanvasImageWidth;
      lastBox.imageHeight = mainCanvasImageHeight;

      return [...previous];
    });

    setIsRectDrawn(false);
    setIsDrawingMode(false);
  };

  const submitSignatureHandler = async () => {
    const response = await signDocumentForm({
      fetchApiPrivate,
      form_id,
      inputData: editBoxes,
      user_id: user.user_id,
    });

    const pageData = new FormData();

    for (const [index, base64PageImage] of response.data.entries()) {
      const response = await fetch(`data:image/jpeg;base64,${base64PageImage}`);
      const imageBlob = await response.blob();
      const imageFileName = `signed-page-${index + 1}.png`;
      imageBlob.name = imageFileName;
      imageBlob.lastModifiend = new Date();

      const imageFile = new File([imageBlob], imageFileName, {
        type: "image/png",
      });

      pageData.append("Signed-Page", imageFile);
    }

    uploadFormImagesMutation.mutate({
      fetchApiPrivate,
      form_id,
      pageData,
    });

    navigate(`/projects/${project_id}`);
  };

  return (
    <StepContainer>
      <FormContainer>
        <ControlPanel>
          <PageControl>
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
          </PageControl>
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
        </Editor>
        <Terms>
          <input
            id="terms"
            type="checkbox"
            onChange={() => setIsAgreed(true)}
          />
          <label htmlFor="terms">
            I agree to the terms and conditions of the agreement.
          </label>
        </Terms>
        <SignButton disabled={!isAgreed} onClick={submitSignatureHandler}>
          Sign
        </SignButton>
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

const ControlPanel = styled.div`
  background-color: #868e96;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;

  button {
    border: none;
    border-radius: 5px;
    height: 25px;
    width: 150px;
    background-color: white;
    color: var(--primary-color);
    font-size: 15px;
    cursor: pointer;

    &:hover {
      transition: all 0.3s;
      color: white;
      background-color: var(--primary-color);
    }

    &:disabled {
      background-color: #adb5bd;
    }

    &[disabled]:hover {
      background-color: #adb5bd;
      color: var(--primary-color);
    }
  }
`;

const PageControl = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  button {
    width: 60px;
  }
`;

const Terms = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
  gap: 10px;
  margin-left: 20px;
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
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 15px;

  button {
    border: none;
    border-radius: 5px;
    height: 25px;
    width: 60px;
    background-color: var(--primary-color);
    color: white;
    font-size: 15px;
    cursor: pointer;

    &:hover {
      transition: all 0.3s;
      color: white;
      background-color: #4dabf7;
    }

    &:disabled {
      background-color: #adb5bd;
      color: #868e96;
    }

    &[disabled]:hover {
      background-color: #adb5bd;
      color: #868e96;
    }
  }
`;

const InputPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-left: 30px;
`;

const Editor = styled.div`
  width: 90%;
  height: 30%;
  display: grid;
  grid-template-rows: 17% 83%;
`;

const EditorNav = styled.div`
  background: var(--primary-color);
  color: white;
  font-weight: 500;
  font-size: 20px;
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
  background-color: #f8f9fa;
  border: solid 1px var(--primary-color);
`;

const SignButton = styled.button`
  border: none;
  border-radius: 5px;
  height: 40px;
  width: 90px;
  background-color: var(--primary-color);
  color: white;
  font-size: 15px;
  cursor: pointer;

  &:hover {
    transition: all 0.3s;
    color: white;
    background-color: #69db7c;
  }

  &:disabled {
    background-color: #adb5bd;
    color: #868e96;
  }

  &[disabled]:hover {
    background-color: #adb5bd;
    color: #868e96;
  }
`;
