import PageRegister from "./pages/PageRegister";
import PageHome from "./pages/PageHome";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageLogin from "./pages/PageLogin";
import PageProfileImage from "./pages/PageProfileImage";
import PageRegisterFaceID from "./pages/PageRegisterFaceID";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageHome />} />
        <Route path="/login" element={<PageLogin />} />
        <Route path="/register" element={<PageRegister />} />
        <Route path="/profile/faceid" element={<PageRegisterFaceID />} />
        <Route path="/profile/:user_id/image" element={<PageProfileImage />} />
      </Routes>
    </Router>
  );
}

export default App;
