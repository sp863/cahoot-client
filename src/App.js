import { Route, Routes, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProfileImage from "./modal-pages/ProfileImage";
import ProfileFaceId from "./modal-pages/ProfileFaceId";
import Layout from "./components/Layout";
import Page404 from "./components/Page404";
import RequireAuth from "./components/RequireAuth";
import Profile from "./modal-pages/Profile";
import PersistLogin from "./components/PersistLogin";
import MyProjects from "./pages/MyProjects";
import ProjectDashboard from "./pages/ProjectDashboard";
import DocForms from "./modal-pages/DocForms";
import DocUploadForm from "./components/DocUploadForm";
import { QueryClient, QueryClientProvider } from "react-query";
import SignForm from "./modal-pages/SignForm";

function App() {
  const queryClient = new QueryClient();
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* <Route path="*" element={<Page404 />} /> */}
        </Route>
      </Routes>

      <Routes location={background || location}>
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/faceid" element={<ProfileFaceId />} />
            <Route path="/profile/:user_id/image" element={<ProfileImage />} />
            <Route path="/projects" element={<MyProjects />} />
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
        </Routes>
      )}
    </QueryClientProvider>
  );
}

export default App;
