import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import DigitalSignature from "../components/DigitalSignature";
import FaceIdVerification from "./FaceIdVerification";
import ModalPage from "../components/ModalPage";
import useApiPrivate from "../hooks/apiPrivate-hook";
import useAuth from "../hooks/auth-hook";

const SignForm = () => {
  const navigate = useNavigate("");
  const auth = useAuth();
  const fetchApiPrivate = useApiPrivate();

  const [steps, setSteps] = useState(0);

  return (
    <ModalPage>
      <ModalHeader>
        {steps === 0 && <h3>Face ID Verification</h3>}
        {steps === 1 && <h3>Digital Signature</h3>}
        <ProgressContainer></ProgressContainer>
        <button onClick={() => navigate(-1)}>X</button>
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
  background-color: aqua;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
`;

const ProgressContainer = styled.div``;
