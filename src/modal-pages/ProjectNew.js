import { useState } from "react";
import Modal from "../components/Modal";
import useApiPrivate from "../hooks/apiPrivate-hook";
import useProjectMutation from "../hooks/project-mutation-hook";

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
      <h1>New Project</h1>
      <form onSubmit={createProjectHandler}>
        <label htmlFor="project-name">Project Name</label>
        <input
          id="project-name"
          type="text"
          onChange={(event) => setProjectName(event.target.value)}
          value={projectName}
        />
        <button type="submit">Create Project</button>
      </form>
      <button onClick={() => closeModal(false)}>X</button>
    </Modal>
  );
};

export default ProjectNew;
