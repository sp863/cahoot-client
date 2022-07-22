import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import useApiPrivate from "../hooks/apiPrivate-hook";
import useFormMutation from "../hooks/doc-mutation-hook";
import ModalPage from "./ModalPage";
import PDFViewer from "./PDFViewer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faFileArrowUp } from "@fortawesome/free-solid-svg-icons";

//TODO: document successfully uploaded CSS로 좀 더 부드럽게
const DocUploadForm = () => {
  const [docTitle, setDocTitle] = useState("");
  const [formPdfFile, setFormPdfFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formImages, setFormImages] = useState([]);
  const [requiredSignatures, setRequiredSignatures] = useState(0);

  const fileRef = useRef(null);
  const navigate = useNavigate();
  const { project_id } = useParams();
  const fetchApiPrivate = useApiPrivate();

  const { uploadFormMutation } = useFormMutation();

  useEffect(() => {
    if (!uploadSuccess) return;

    const timeout = setTimeout(() => setUploadSuccess(false), 3000);

    return () => clearTimeout(timeout);
  }, [uploadSuccess]);

  const uploadFormHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    for (const [index, base64FormImage] of formImages.entries()) {
      const response = await fetch(base64FormImage);
      const imageBlob = await response.blob();
      const imageFileName = `${docTitle}-page-${index + 1}.png`;
      imageBlob.name = imageFileName;
      imageBlob.lastModifiend = new Date();

      const imageFile = new File([imageBlob], imageFileName, {
        type: "image/png",
      });

      formData.append("Doc-Form", imageFile);
    }

    formData.append("Doc-Form", formPdfFile);
    formData.append("title", docTitle);
    formData.append("project_id", project_id);
    formData.append("requiredSignatures", requiredSignatures);

    uploadFormMutation.mutate({
      fetchApiPrivate,
      formData,
    });

    setUploadSuccess(true);
    setDocTitle("");
    setFormPdfFile(null);
    fileRef.current.value = null;
  };

  const inputFormFileHandler = (event) => {
    setFormPdfFile(event.target.files[0]);
    setFormImages([]);
  };

  return (
    <ModalPage>
      <UploadContainer>
        <Heading>
          <h2>New Form</h2>
          {uploadSuccess && <p>Document uploaded</p>}
          <StyledCloseIcon icon={faXmark} onClick={() => navigate(-1)} />
        </Heading>
        <MainContainer>
          <FormContainer>
            <Form onSubmit={uploadFormHandler}>
              <label htmlFor="form-title">Document Title</label>
              <input
                id="form-title"
                type="text"
                onChange={(event) => setDocTitle(event.target.value)}
                value={docTitle}
                required
              />
              <label htmlFor="form-file">File</label>
              <input
                id="form-file"
                ref={fileRef}
                type="file"
                onChange={inputFormFileHandler}
                accept=".pdf"
              />
              <div>
                <label htmlFor="required-signatures">
                  Number of Required Signatures
                </label>
                <input
                  id="required-signatures"
                  type="number"
                  onChange={(event) =>
                    setRequiredSignatures(event.target.value)
                  }
                  min={1}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={
                  !docTitle ||
                  !formPdfFile ||
                  formImages?.length === 0 ||
                  !requiredSignatures
                }
              >
                <StyledUploadIcon icon={faFileArrowUp} />
              </button>
            </Form>
          </FormContainer>
          <PreviewContainer>
            {formPdfFile && (
              <PDFViewer pdfFile={formPdfFile} addPdfImage={setFormImages} />
            )}
          </PreviewContainer>
        </MainContainer>
      </UploadContainer>
    </ModalPage>
  );
};

const UploadContainer = styled.div`
  display: grid;
  grid-template-rows: 5% 95%;
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  h2 {
    font-size: 20px;
    font-weight: 700;
  }
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 25px;
  padding: 5px 10px;
  color: var(--primary-color);
  position: absolute;
  top: 0;
  right: 0;

  &:hover {
    transition: all 0.2s;
    font-size: 30px;
  }
`;

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
`;

const FormContainer = styled.div`
  height: 690px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  button {
    border: none;
    outline: none;
  }
`;

const StyledUploadIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 25px;
  padding: 10px;
  border-radius: 5px;
  color: var(--primary-color);

  &:hover {
    transition: all 0.2s;
    color: white;
    background-color: var(--primary-color);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
`;

const PreviewContainer = styled.div`
  height: 690px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #343a40;
`;

export default DocUploadForm;
