import { useState } from "react";
import styled from "styled-components";
import Modal from "../components/Modal";
import useApiPrivate from "../hooks/apiPrivate-hook";
import useProjectMutation from "../hooks/project-mutation-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ProjectNew = ({ user_id, closeModal }) => {
  const [projectName, setProjectName] = useState("");
  const fetchApiPrivate = useApiPrivate();
  const { createProjectMutation } = useProjectMutation();

  const createProjectHandler = async (event) => {
    event.preventDefault();

    createProjectMutation.mutate({
      fetchApiPrivate,
      newProjectInfo: {
        name: projectName,
        user_id,
      },
    });

    setProjectName("");
    closeModal(false);
  };

  return (
    <Modal>
      <NewProjectContainer>
        <StyledCloseIcon icon={faXmark} onClick={() => closeModal(false)} />
        <h1>New Project</h1>
        <Form onSubmit={createProjectHandler}>
          <UserInput>
            <label htmlFor="project-name">Project Name</label>
            <input
              id="project-name"
              type="text"
              onChange={(event) => setProjectName(event.target.value)}
              value={projectName}
            />
          </UserInput>
          <button type="submit" disabled={!projectName}>
            Create Project
          </button>
        </Form>
      </NewProjectContainer>
    </Modal>
  );
};

const NewProjectContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  position: relative;

  h1 {
    font-size: 25px;
    margin-top: 60px;
    font-weight: 500;
  }
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 20px;
  padding: 5px 10px;
  color: var(--primary_color);
  position: absolute;
  top: -2%;
  right: -2%;

  &:hover {
    transition: all 0.2s;
    font-size: 25px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;

  button {
    width: 50%;
    padding: 10px;
    border: solid 1px var(--primary-color);
    background-color: var(--primary-color);
    color: white;
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      background-color: white;
      border: solid 1px var(--primary-color);
      transition: all 0.3s;
      color: var(--primary-color);
    }

    &:disabled {
      background-color: #adb5bd;
      color: #868e96;
    }

    &[disabled]:hover {
      background-color: #adb5bd;
      color: #868e96;
    }
  }
`;

const UserInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;

  label {
    font-size: 20px;
  }

  input {
    width: 70%;
    height: 30px;
  }
`;

export default ProjectNew;
