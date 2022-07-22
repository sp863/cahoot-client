import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getDocumentFormFile, getProjectDocFormsList } from "../api/docApi";
import ModalPage from "../components/ModalPage";
import useApiPrivate from "../hooks/apiPrivate-hook";
import useAuth from "../hooks/auth-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCirclePlus,
  faXmark,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";

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

    console.log(form_id, form_title);
    // const response = await getDocumentFormFile(fetchApiPrivate, form_id);
    // const tempLink = document.createElement("a");

    // tempLink.href = response.data;
    // tempLink.download = `${form_title}.pdf`;
    // document.body.appendChild(tempLink);
    // tempLink.click();
    // tempLink.remove();
  };

  return (
    <ModalPage>
      <Container>
        <Heading>
          <h2>Document Forms</h2>
          <StyledCloseIcon icon={faXmark} onClick={() => navigate(-1)} />
        </Heading>
        <MainContainer>
          <DocFormsContainer>
            <AddFormContainer>
              <StyledLink
                to={`${location.pathname}/new`}
                state={{ background: location }}
              >
                <StyledFontAwesomeIcon icon={faFileCirclePlus} />
                <p>Add New Form</p>
              </StyledLink>
            </AddFormContainer>
            {docForms?.data.length > 0 &&
              docForms.data.map((form) => {
                console.log(form);
                return (
                  <FormContainer key={form._id}>
                    <h2>{form.title}</h2>
                    <FormThumnail
                      id={form._id}
                      src={form.imageUrls[0]}
                      alt="form thumnail"
                      onClick={previewFormHandler}
                      width={150}
                    />
                    {form.signed.includes(auth.user.email) ? (
                      <SignContainer>
                        <p>Signed ✅</p>
                        <StyledDownloadIcon
                          icon={faFileArrowDown}
                          id={form._id}
                          title={form.title}
                          onClick={downloadFormHandler}
                        />
                      </SignContainer>
                    ) : (
                      <SignContainer>
                        <Link
                          to={`${location.pathname}/${form._id}/sign`}
                          state={{ background: location }}
                          disabled={form.signed.includes(auth.user.email)}
                        >
                          Sign
                        </Link>
                      </SignContainer>
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
  background-color: #343a40;
  border-radius: 5px;
  color: white;
  position: relative;

  h2 {
    font-weight: 500;
  }
`;

const SignContainer = styled.div`
  a:hover {
    color: var(--primary-color);
    background-color: white;
    padding: 5px 10px;
    border-radius: 5px;
  }
`;

const FormThumnail = styled.img`
  cursor: pointer;
`;

const StyledDownloadIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 25px;
  padding: 10px;
  border-radius: 5px;
  color: white;
  position: absolute;
  bottom: 0;
  right: 0;

  &:hover {
    transition: all 0.2s;
    color: var(--primary-color);
    background-color: white;
  }
`;

const StyledLink = styled(Link)`
  padding: 40px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    transition: all 0.2s;
    background-color: #69db7c;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 50px;
  margin-bottom: 10px;
  cursor: pointer;
`;

export default DocForms;
