import { Link, useLocation, useParams } from "react-router-dom";

const ProjectDashboard = () => {
  const { project_id } = useParams();
  const location = useLocation();

  return (
    <section>
      <h1>Project Name</h1>
      <Link to="/projects/1/doc-forms" state={{ background: location }}>
        Document Forms
      </Link>
    </section>
  );
};

export default ProjectDashboard;
