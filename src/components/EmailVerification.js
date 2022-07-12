import { useNavigate } from "react-router";

const EmailVerification = ({ auth, fetchApiPrivate, completeStep }) => {
  const navigate = useNavigate();

  const emailVerified = () => {
    completeStep((previous) => previous + 1);
  };

  return (
    <div>
      <h1>Step 1</h1>
      <h2>Email Verification</h2>
      <button onClick={emailVerified}>Next</button>
    </div>
  );
};

export default EmailVerification;
