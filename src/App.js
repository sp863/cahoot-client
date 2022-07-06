import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProfileImage from "./pages/ProfileImage";
import ProfileFaceID from "./pages/ProfileFaceID";
import Layout from "./components/Layout";
import Page404 from "./components/Page404";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth />}>
          <Route path="/profile/faceid" element={<ProfileFaceID />} />
          <Route path="/profile/:user_id/image" element={<ProfileImage />} />
        </Route>

        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
}

export default App;
