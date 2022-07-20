import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getDocumentFormFile, getProjectDocFormsList } from "../api/docApi";
import ModalPage from "../components/ModalPage";
import useApiPrivate from "../hooks/apiPrivate-hook";
import useAuth from "../hooks/auth-hook";

const DocForms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fetchApiPrivate = useApiPrivate();
  const { project_id } = useParams();
  const { auth } = useAuth();
  const [currentForm, setCurrentForm] = useState(null);
  const { data: docForms } = useQuery(["forms", project_id], () =>
    getProjectDocFormsList(fetchApiPrivate, project_id)
  );

  const previewFormHandler = async (event) => {
    const form_id = event.target.id;
    const targetForm = docForms.data.find((form) => form._id === form_id);

    setCurrentForm(targetForm);
  };

  const downloadFormHandler = async (event) => {
    const form_id = event.target.id;
    const form_title = event.target.getAttribute("title");
    const response = await getDocumentFormFile(fetchApiPrivate, form_id);
    const tempLink = document.createElement("a");

    tempLink.href = response.data;
    tempLink.download = `${form_title}.pdf`;
    document.body.appendChild(tempLink);
    tempLink.click();
    tempLink.remove();
  };

  return (
    <ModalPage>
      <Container>
        <Heading>
          <h2>Document Forms</h2>
          <button onClick={() => navigate(-1)}>x</button>
        </Heading>
        <MainContainer>
          <DocFormsContainer>
            <AddFormContainer>
              <Link
                to={`${location.pathname}/new`}
                state={{ background: location }}
              >
                Add New Form
              </Link>
            </AddFormContainer>
            {docForms?.data.length > 0 &&
              docForms.data.map((form) => {
                console.log(form);
                return (
                  <FormContainer key={form._id}>
                    <div>{form.title}</div>
                    <FormThumnail
                      id={form._id}
                      src={form.imageUrls[0]}
                      alt="form thumnail"
                      onClick={previewFormHandler}
                      width={150}
                    />
                    {form.signed.includes(auth.user.email) ? (
                      <div>
                        Signed ✅
                        <button
                          id={form._id}
                          title={form.title}
                          onClick={downloadFormHandler}
                        >
                          Download
                        </button>
                      </div>
                    ) : (
                      <>
                        <Link
                          to={`${location.pathname}/${form._id}/sign`}
                          state={{ background: location }}
                          disabled={form.signed.includes(auth.user.email)}
                        >
                          Sign
                        </Link>
                        <button id={form._id} onClick={downloadFormHandler}>
                          Download
                        </button>
                      </>
                    )}
                  </FormContainer>
                );
              })}
          </DocFormsContainer>
          <PreviewContainer>
            {currentForm &&
              currentForm.imageUrls.map((formImage, index) => {
                return (
                  <FormImage
                    key={`currentForm._id-page-${index}`}
                    src={formImage}
                    alt="page"
                    width={600}
                  />
                );
              })}
          </PreviewContainer>
        </MainContainer>
      </Container>
    </ModalPage>
  );
};

const FormImage = styled.img`
  padding: 10px;
`;

const PreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  align-items: center;
  gap: 5px;
  background-color: #343a40;
`;

const Container = styled.div`
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

const AddFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const DocFormsContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid black;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 300px); //TODO: need to fix this
  gap: 5px 5px;
  overflow-y: auto;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: aqua;
  border: 1px solid black;
`;

const FormThumnail = styled.img`
  cursor: pointer;
`;

export default DocForms;
