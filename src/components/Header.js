import useAuth from "../hooks/auth-hook";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/authApi";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { getUserProfileImage } from "../api/userApi";
import useApiPrivate from "../hooks/apiPrivate-hook";

const Header = () => {
  const { auth, setAuth } = useAuth();
  const fetchApiPrivate = useApiPrivate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      profileImageHandler();
    }
  }, [auth]);

  const profileImageHandler = async () => {
    const response = await getUserProfileImage(
      fetchApiPrivate,
      auth.user.user_id
    );

    setUserImage(response.data);
  };

  const logoutHandler = async () => {
    try {
      await logoutUser();
      setAuth(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isModalOpen && (
        <Modal>
          <Link
            to="/profile/faceid"
            state={{ background: location }}
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            Register Face ID
          </Link>
          <Link
            to={`/profile/${auth.user.user_id}/image`}
            state={{ background: location }}
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            Profile Image
          </Link>
        </Modal>
      )}
      <div>Header</div>
      {auth ? (
        <>
          <img
            src={userImage}
            alt="user profile"
            onClick={() => setIsModalOpen(!isModalOpen)}
          />
          <button onClick={logoutHandler}>Sign out</button>
        </>
      ) : (
        <Link to="/login">Sign in</Link>
      )}
    </>
  );
};

export default Header;
