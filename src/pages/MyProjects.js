import { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getMyProjects } from "../api/userApi";
import useApiPrivate from "../hooks/apiPrivate-hook";
import useAuth from "../hooks/auth-hook";
import ProjectNew from "../modal-pages/ProjectNew";

const MyProjects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { auth } = useAuth();
  const fetchApiPrivate = useApiPrivate();
  const { data: myProjects } = useQuery(["projects", auth.user.user_id], () =>
    getMyProjects(fetchApiPrivate, auth.user.user_id)
  );

  return (
    <section>
      {isModalOpen && (
        <ProjectNew user_id={auth.user.user_id} closeModal={setIsModalOpen} />
      )}
      <h1>My Projects</h1>
      <button onClick={() => setIsModalOpen(true)}>New Project</button>
      {myProjects?.data.length > 0 &&
        myProjects.data.map((project) => {
          return (
            <ProjectContainer key={project._id}>
              <Link to={`/projects/${project._id}`}>{project.name}</Link>
            </ProjectContainer>
          );
        })}
    </section>
  );
};

export default MyProjects;

const ProjectContainer = styled.div``;
