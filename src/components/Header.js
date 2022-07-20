import useAuth from "../hooks/auth-hook";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  console.log(auth);

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
      setIsModalOpen(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <HeaderContainer>
      {isModalOpen && (
        <Modal>
          <Link
            to={`/profile/${auth?.user.user_id}/faceid`}
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            Register Face ID
          </Link>
          <Link
            to={`/profile/${auth?.user.user_id}/image`}
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            Profile Image
          </Link>
          <button onClick={logoutHandler}>Sign out</button>
        </Modal>
      )}
      <NavContainer>
        <h1>Cahoot</h1>
        {auth ? (
          <NavControl>
            <Link to={"/projects"}>My Projects</Link>
            <ProfileImg
              src={userImage}
              alt="user profile"
              onClick={() => setIsModalOpen(!isModalOpen)}
            />
          </NavControl>
        ) : (
          <NavControl>
            <Link to="/login">Sign in</Link>
          </NavControl>
        )}
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 10%;
`;

const NavControl = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;
  margin-right: 30px;
`;

const ProfileImg = styled.img`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  transition: all 0.4s ease-in;

  &:focus {
    width: 65px;
    height: 65px;
    border-radius: 50%;
  }
`;

const HeaderContainer = styled.div`
  width: 100%;
  background-color: lightblue;
`;
