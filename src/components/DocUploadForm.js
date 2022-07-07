import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { uploadNewDocForm } from "../api/docApi";
import useApiPrivate from "../hooks/apiPrivate-hook";
import ModalPage from "./ModalPage";

const DocUploadForm = () => {
  const [docTitle, setDocTitle] = useState("");
  const [formPdfFile, setFormPdfFile] = useState(null);
  const fetchApiPrivate = useApiPrivate();
  const navigate = useNavigate();

  const uploadHandler = async () => {
    const formData = new FormData();
    formData.append("Doc-Form", formPdfFile);

    const response = await uploadNewDocForm(fetchApiPrivate, formData);

    console.log(response);
  };

  return (
    <ModalPage>
      <UploadContainer>
        <Heading>
          <h3>New Form</h3>
          <button onClick={() => navigate(-1)}>Back</button>
        </Heading>
        <MainContainer>
          <FormContainer>
            <form onSubmit={uploadHandler}>
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
                type="file"
                onChange={(event) => setFormPdfFile(event.target.files[0])}
                accept=".pdf" //TODO: image 도 할 수 있게금 나중에 추가
              />
              <button type="submit" disabled={!docTitle || !formPdfFile}>
                Upload
              </button>
            </form>
          </FormContainer>
          <PreviewContainer></PreviewContainer>
        </MainContainer>
      </UploadContainer>
    </ModalPage>
  );
};

const UploadContainer = styled.div`
  display: grid;
  grid-template-rows: 5% 95%;
  width: 100%;
  height: 100%;
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  width: 100%;
  height: 100%;
`;

const FormContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid black;
`;

const PreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid black;
`;

export default DocUploadForm;
