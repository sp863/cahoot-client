import useAuth from "../hooks/auth-hook";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/authApi";

const Header = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutUser();
      setAuth({});
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>Header</div>
      {auth ? (
        <button onClick={logoutHandler}>Sign out</button>
      ) : (
        <Link to="/login">Sign in</Link>
      )}
    </>
  );
};

export default Header;
