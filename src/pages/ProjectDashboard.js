import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { getProject } from "../api/projectApi";
import useApiPrivate from "../hooks/apiPrivate-hook";
import TaskList from "../components/TaskList";

const ProjectDashboard = () => {
  const location = useLocation();
  const fetchApiPrivate = useApiPrivate();
  const { project_id } = useParams();
  const [isChatting, setIsChatting] = useState(false);
  const { data: project } = useQuery(["projects", project_id], () =>
    getProject(fetchApiPrivate, project_id)
  );

  console.log(project);

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>{`Project Dashboard - ${project?.data.name}`}</h1>
      </DashboardHeader>
      <MainSection>
        <TaskSection>
          <ProgressSection></ProgressSection>
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
            <Link
              to={`${location.pathname}/doc-forms`}
              state={{ background: location }}
            >
              Document Forms
            </Link>
          </ResourceSection>
          <MemberSection></MemberSection>
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
  background-color: lightpink;
`;

const TaskSection = styled.div`
  background-color: lightgrey;
  display: grid;
  grid-template-rows: 13% 4% 83%;
`;

const TaskLabel = styled.div`
  background-color: aqua;
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 2fr;
  align-items: center;
  justify-items: center;
`;

const ProgressSection = styled.div`
  background-color: brown;
`;

const ControlSection = styled.div`
  background-color: aqua;
  display: grid;
  grid-template-rows: 15% 85%;
`;

const ResourceSection = styled.div`
  background-color: yellow;
`;

const MemberSection = styled.div`
  background-color: antiquewhite;
`;

const MainSection = styled.div`
  background-color: lightgreen;
  display: grid;
  grid-template-columns: 60% 40%;
`;

export default ProjectDashboard;
