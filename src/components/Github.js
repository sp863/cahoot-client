import github from "../img/github.jpeg";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import useProjectMutation from "../hooks/project-mutation-hook";
import useApiPrivate from "../hooks/apiPrivate-hook";
import { useEffect } from "react";

const Github = ({ project_id, url }) => {
  const [githubUrl, setGithubUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const fetchApiPrivate = useApiPrivate();
  const { updateUrlMutation } = useProjectMutation();

  useEffect(() => {
    if (!url) return;

    setGithubUrl(url);
  }, [url]);

  const editGithubHandler = () => {
    updateUrlMutation.mutate({
      fetchApiPrivate,
      project_id,
      githubUrl,
    });

    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <InputUrlContainer>
        <label htmlFor="url">Github URL</label>
        <InputUrl
          id="url"
          type="text"
          value={githubUrl}
          onChange={(event) => setGithubUrl(event.target.value)}
        />
        <button onClick={editGithubHandler}>save</button>
        <StyledCloseIcon
          icon={faXmark}
          onClick={() => setIsEditing(!isEditing)}
        />
      </InputUrlContainer>
    );
  }

  return (
    <GithubSection>
      <img src={github} alt="github" />
      {url ? (
        <Link to={`${url}`} target="_blank" rel="noreferrer">
          Project Github Link
        </Link>
      ) : (
        "none"
      )}
      <StyledFontAwesomeIcon
        icon={faPen}
        onClick={() => setIsEditing(!isEditing)}
      />
    </GithubSection>
  );
};

const GithubSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom: solid 2px #ced4da;
  position: relative;

  img {
    height: 65px;
  }

  a {
    font-size: 20px;
    text-decoration: underline;

    &:hover {
      color: red;
    }
  }
`;

const InputUrlContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom: solid 2px #ced4da;
  position: relative;

  label {
    padding: 10px;
  }

  button {
    font-family: "Montserrat", sans-serif;
    margin-left: 5px;
    color: white;
    background-color: var(--primary-color);
    border-radius: 5px;
    padding: 5px;
    outline: none;
    border: none;
  }
`;

const InputUrl = styled.input`
  width: 60%;
  height: 30%;
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 20px;
  padding: 5px 10px;
  position: absolute;
  top: 0;
  right: 0;

  &:hover {
    transition: all 0.2s;
    font-size: 25px;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 20px;
  padding: 5px 10px;
  position: absolute;
  top: 0;
  right: 0;

  &:hover {
    transition: all 0.2s;
    font-size: 25px;
  }
`;

export default Github;
