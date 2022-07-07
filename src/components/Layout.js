import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  //header and footer can be here
  return (
    <main className="App">
      <Header />
      <Outlet />
    </main>
  );
};

export default Layout;
