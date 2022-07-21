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
        <h1 onClick={() => navigate("/")}>Cahoot</h1>
        {auth ? (
          <NavControl>
            <Link to={"/projects"}>My Projects</Link>
            <ImageContainer>
              <img
                src={userImage}
                alt="user profile"
                onClick={() => setIsModalOpen(!isModalOpen)}
              />
            </ImageContainer>
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

const HeaderContainer = styled.div`
  width: 100%;
  background-color: var(--primary-color);
  color: white;
`;

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 10%;

  h1 {
    padding: 20px 30px;
    font-size: 50px;
    cursor: pointer;

    &:hover {
      color: var(--hover-color);
      transition: all 0.4s;
    }
  }

  a {
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    text-decoration: none;
    transition: all 0.4s;
    color: var(--primary-color);

    &:hover {
      background-color: var(--hover-color);
    }
  }
`;

const NavControl = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;
  margin-right: 30px;
`;

const ImageContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 55px;
  height: 55px;
  overflow: hidden;
  border-radius: 50%;

  img {
    width: auto;
    height: 100%;
  }
`;
