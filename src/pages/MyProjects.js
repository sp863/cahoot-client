import { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getMyProjects } from "../api/userApi";
import useApiPrivate from "../hooks/apiPrivate-hook";
import useAuth from "../hooks/auth-hook";
import ProjectNew from "../modal-pages/ProjectNew";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";

const MyProjects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { auth } = useAuth();
  const fetchApiPrivate = useApiPrivate();
  const { data: myProjects } = useQuery(["projects", auth.user.user_id], () =>
    getMyProjects(fetchApiPrivate, auth.user.user_id)
  );

  return (
    <MyProjectsContainer>
      {isModalOpen && (
        <ProjectNew user_id={auth.user.user_id} closeModal={setIsModalOpen} />
      )}
      <h1>{`${auth.user.name}'s Projects`}</h1>
      <ProjectContainer>
        <Project onClick={() => setIsModalOpen(true)}>
          <AddProject>
            <StyledFontAwesomeIcon icon={faFolderPlus} />
            <p>New Project</p>
          </AddProject>
        </Project>
        {myProjects?.data.length > 0 &&
          myProjects.data.map((project) => {
            return (
              <Project key={project._id}>
                <StyledLink to={`/projects/${project._id}`}>
                  <StyledFontAwesomeIcon icon={faFolderOpen} />
                  <p>{project.name}</p>
                </StyledLink>
              </Project>
            );
          })}
      </ProjectContainer>
    </MyProjectsContainer>
  );
};

export default MyProjects;

const MyProjectsContainer = styled.div`
  height: 90vh;

  h1 {
    padding: 20px;
    font-weight: 700;
    font-size: 35px;
  }
`;

const ProjectContainer = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const Project = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    text-align: center;
    font-size: 20px;
    font-weight: 500;
  }
`;

const AddProject = styled.div`
  padding: 40px;
  border-radius: 5px;

  &:hover {
    transition: all 0.2s;
    background-color: #69db7c;
  }
`;

const StyledLink = styled(Link)`
  padding: 40px;
  border-radius: 5px;

  &:hover {
    transition: all 0.2s;
    background-color: #4dabf7;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 100px;
  margin-bottom: 10px;
  cursor: pointer;
`;
