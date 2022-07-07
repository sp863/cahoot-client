import { Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/faceid" element={<ProfileFaceId />} />
            <Route path="/profile/:user_id/image" element={<ProfileImage />} />
          </Route>
        </Route>

        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
}

export default App;
