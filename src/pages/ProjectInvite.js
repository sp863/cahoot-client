import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { verifyInvitation } from "../api/projectApi";
import useApiPrivate from "../hooks/apiPrivate-hook";

const ProjectInvite = () => {
  const { confirmationCode } = useParams();
  const fetchApiPrivate = useApiPrivate();
  const [verifyStatus, setVerifyStatus] = useState("pending");
  const [project, setProject] = useState("");
  const location = useLocation();

  useEffect(() => {
    const checkConfirmationCode = async () => {
      try {
        const response = await verifyInvitation(fetchApiPrivate, {
          code: confirmationCode,
        });
        const result = response.data.result;

        setVerifyStatus(result);
        setProject(result);
      } catch (error) {
        console.log(error.response.data.result);
        setVerifyStatus(error.response.data.result);
      }
    };

    checkConfirmationCode();
  }, []);

  if (verifyStatus === "pending") {
    return <h1>Loading</h1>;
  } else if (verifyStatus === "failure") {
    return (
      <WelcomeProject>
        <h1>Invalid invitation. Please contact your team.</h1>
      </WelcomeProject>
    );
  } else if (verifyStatus === "invalid account") {
    return (
      <WelcomeProject>
        <h1>Please register before responding to this invite.</h1>
        <Link to="/register">Register here.</Link>
      </WelcomeProject>
    );
  }
  return (
    <WelcomeProject>
      <h1>{`Welcome to Project ${project}`}</h1>
      <Link to="/projects">To My Projects</Link>
      <Link to={"/login"}>Login</Link>
    </WelcomeProject>
  );
};

const WelcomeProject = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default ProjectInvite;
