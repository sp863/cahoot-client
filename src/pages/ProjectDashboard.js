import { useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { getProject } from "../api/projectApi";
import useApiPrivate from "../hooks/apiPrivate-hook";
import TaskList from "../components/TaskList";
import MemberList from "../components/MemberList";
import Modal from "../components/Modal";
import Invitation from "../components/Invitation";
import ProgressBar from "../components/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileSignature, faUserPlus } from "@fortawesome/free-solid-svg-icons";

const ProjectDashboard = () => {
  const location = useLocation();
  const fetchApiPrivate = useApiPrivate();
  const { project_id } = useParams();

  const [isModalOpen, setModalOpen] = useState(false);
  const { data: project } = useQuery(["projects", project_id], () =>
    getProject(fetchApiPrivate, project_id)
  );

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>{`Project Dashboard - ${project?.data.name}`}</h1>
        <Link to="/projects">My Projects</Link>
      </DashboardHeader>
      <MainSection>
        <TaskSection>
          <ProgressSection>
            <h2>Tasks Completed</h2>
            <ProgressBar tasks={project?.data.tasks} />
          </ProgressSection>
          <TaskLabel>
            <div>Task</div>
            <div>End Date</div>
            <div>Status</div>
            <div>Assignees</div>
          </TaskLabel>
          <TaskList
            fetchApiPrivate={fetchApiPrivate}
            members={project?.data.participants}
            tasks={project?.data.tasks}
            project_id={project_id}
          />
        </TaskSection>
        <ControlSection>
          <ResourceSection>
            {isModalOpen && (
              <Modal>
                <Invitation
                  fetchApiPrivate={fetchApiPrivate}
                  project_id={project_id}
                  closeModal={setModalOpen}
                />
              </Modal>
            )}
            <StyledLink
              to={`${location.pathname}/doc-forms`}
              state={{ background: location }}
            >
              <StyledFontAwesomeIcon icon={faFileSignature} />
              <p>Project Docs</p>
            </StyledLink>
            <AddMember onClick={() => setModalOpen(true)}>
              <StyledFontAwesomeIcon icon={faUserPlus} />
              <p>Invite Member</p>
            </AddMember>
          </ResourceSection>
          <MemberList
            fetchApiPrivate={fetchApiPrivate}
            members={project?.data.participants}
            rooms={project?.data.rooms}
            project_id={project_id}
            projectUrl={project?.data.projectUrl}
          />
        </ControlSection>
      </MainSection>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  display: grid;
  grid-template-rows: 10% 90%;
  height: 100vh;
`;

const DashboardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: var(--primary-color);
  height: 100%;
  justify-content: space-between;

  h1 {
    font-size: 40px;
    font-weight: 500;
    color: white;
  }

  a {
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    text-decoration: none;
    transition: all 0.4s;
    color: var(--primary-color);
    font-weight: 500;

    &:hover {
      background-color: var(--hover-color);
    }
  }
`;

const TaskSection = styled.div`
  display: grid;
  grid-template-rows: 13% 4% 83%;
`;

const TaskLabel = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 2fr;
  align-items: center;
  justify-items: center;
  font-weight: 500;
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;

  h2 {
    letter-spacing: 3px;
    text-decoration: underline;
    align-self: flex-start;
    padding: 0px 50px;
  }
`;

const ControlSection = styled.div`
  display: grid;
  grid-template-rows: 15% 85%;
  border-left: solid 2px #ced4da;
`;

const ResourceSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 80px;
  border-bottom: solid 2px #ced4da;
`;

const MainSection = styled.div`
  display: grid;
  grid-template-columns: 60% 40%;
`;

const AddMember = styled.div`
  width: 25%;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 15px;

  &:hover {
    transition: all 0.2s;
    background-color: #4dabf7;
  }
`;

const StyledLink = styled(Link)`
  width: 25%;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 15px;

  &:hover {
    transition: all 0.2s;
    background-color: #4dabf7;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 50px;
  margin-bottom: 10px;
  cursor: pointer;
`;

export default ProjectDashboard;
