import PageRegister from "./pages/PageRegister";
import PageHome from "./pages/PageHome";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<PageRegister />} />
        <Route path="/" element={<PageHome />} />
      </Routes>
    </Router>
  );
}

export default App;
