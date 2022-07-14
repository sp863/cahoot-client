import { useNavigate } from "react-router";

const FaceIdVerification = ({ auth, fetchApiPrivate, completeStep }) => {
  const navigate = useNavigate();

  const faceIdVerified = () => {
    completeStep((previous) => previous + 1);
  };

  return (
    <div>
      <h1>Step 2</h1>
      <h2>FaceID Verification</h2>
      <button onClick={faceIdVerified}>Next</button>
    </div>
  );
};

export default FaceIdVerification;
