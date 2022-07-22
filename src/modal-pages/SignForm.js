import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import DigitalSignature from "../components/DigitalSignature";
import FaceIdVerification from "./FaceIdVerification";
import ModalPage from "../components/ModalPage";
import useApiPrivate from "../hooks/apiPrivate-hook";
import useAuth from "../hooks/auth-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const SignForm = () => {
  const navigate = useNavigate("");
  const auth = useAuth();
  const fetchApiPrivate = useApiPrivate();

  const [steps, setSteps] = useState(0);

  return (
    <ModalPage>
      <ModalHeader>
        {steps === 0 && <h2>Face ID Verification</h2>}
        {steps === 1 && <h2>Digital Signature</h2>}
        <ProgressContainer></ProgressContainer>
        <StyledCloseIcon icon={faXmark} onClick={() => navigate(-1)} />
      </ModalHeader>
      <Main>
        {steps === 0 && (
          <FaceIdVerification
            user={auth.auth.user}
            fetchApiPrivate={fetchApiPrivate}
            completeStep={setSteps}
          />
        )}
        {steps === 1 && (
          <DigitalSignature
            user={auth.auth.user}
            fetchApiPrivate={fetchApiPrivate}
          />
        )}
      </Main>
    </ModalPage>
  );
};

export default SignForm;

const Main = styled.div``;

const ModalHeader = styled.div`
  width: 100%;
  height: 7%;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  align-items: center;
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

const ProgressContainer = styled.div``;
