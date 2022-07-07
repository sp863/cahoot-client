import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import DocUploadForm from "../components/DocUploadForm";
import ModalPage from "../components/ModalPage";

const DocForms = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ModalPage>
      <Container>
        <Heading>
          <h2>Document Forms</h2>
          <button onClick={() => navigate(-1)}>x</button>
        </Heading>
        <MainContainer>
          <DocFormsContainer>
            <Link
              to="/projects/1/doc-forms/new"
              state={{ background: location }}
            >
              Add New Form
            </Link>
          </DocFormsContainer>
          <PreviewContainer></PreviewContainer>
        </MainContainer>
      </Container>
    </ModalPage>
  );
};

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
const DocFormsContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid black;
`;
const PreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid black;
`;

export default DocForms;
