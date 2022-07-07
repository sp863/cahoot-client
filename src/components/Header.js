import useAuth from "../hooks/auth-hook";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/authApi";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { getUserProfileImage } from "../api/userApi";
import useApiPrivate from "../hooks/apiPrivate-hook";
import styled from "styled-components";

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
      <NavContainer>
        <div>Header</div>
        {auth ? (
          <>
            <ProfileImg
              src={userImage}
              alt="user profile"
              onClick={() => setIsModalOpen(!isModalOpen)}
            />
            <button onClick={logoutHandler}>Sign out</button>
          </>
        ) : (
          <Link to="/login">Sign in</Link>
        )}
      </NavContainer>
    </>
  );
};

export default Header;

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 10%;
`;

const ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 40px;
  transition: all 0.4s ease-in;

  &:focus {
    width: 50px;
    height: 50px;
    border-radius: 50px;
  }
`;

const ImageBox = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
