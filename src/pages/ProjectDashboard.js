import { Link, useLocation, useParams } from "react-router-dom";

const ProjectDashboard = () => {
  const location = useLocation();
  const { project_id } = useParams();

  return (
    <section>
      <h1>Project Name</h1>
      <Link
        to={`${location.pathname}/doc-forms`}
        state={{ background: location }}
      >
        Document Forms
      </Link>
    </section>
  );
};

export default ProjectDashboard;
