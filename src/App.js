import { Route, Routes, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProfileImage from "./modal-pages/ProfileImage";
import ProfileFaceId from "./modal-pages/ProfileFaceId";
import Layout from "./components/Layout";
import Page404 from "./components/Page404";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import MyProjects from "./pages/MyProjects";
import ProjectDashboard from "./pages/ProjectDashboard";
import DocForms from "./modal-pages/DocForms";
import DocUploadForm from "./components/DocUploadForm";
import { QueryClient, QueryClientProvider } from "react-query";
import SignForm from "./modal-pages/SignForm";
import ProjectInvite from "./pages/ProjectInvite";
import { GlobalStyles } from "./config/GlobalStyles";

// REACT_APP_BACKEND_URL = http://localhost:3001/
// REACT_APP_BACKEND_URL = http://cahoot-server-dev.ap-northeast-2.elasticbeanstalk.com/

function App() {
  const queryClient = new QueryClient();
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <Routes>
        <Route element={<PersistLogin />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Routes location={background || location}>
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="/projects" element={<MyProjects />} />
              <Route
                path="/profile/:user_id/faceid"
                element={<ProfileFaceId />}
              />
              <Route
                path="/profile/:user_id/image"
                element={<ProfileImage />}
              />
            </Route>

            <Route path="/projects/:project_id" element={<ProjectDashboard />}>
              <Route
                path="/projects/:project_id/doc-forms"
                element={<DocForms />}
              />
              <Route
                path="/projects/:project_id/doc-forms/new"
                element={<DocUploadForm />}
              />
              <Route
                path="/projects/:project_id/doc-forms/:form_id/sign"
                element={<SignForm />}
              />
            </Route>
            <Route
              path="/projects/invite/:confirmationCode"
              element={<ProjectInvite />}
            />
          </Route>
        </Route>
      </Routes>

      {background && (
        <Routes>
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route
                path="/projects/:project_id/doc-forms"
                element={<DocForms />}
              />
              <Route
                path="/projects/:project_id/doc-forms/new"
                element={<DocUploadForm />}
              />
              <Route
                path="/projects/:project_id/doc-forms/:form_id/sign"
                element={<SignForm />}
              />
            </Route>
          </Route>
          <Route path="*" element={<Page404 />} />
        </Routes>
      )}
    </QueryClientProvider>
  );
}

export default App;
