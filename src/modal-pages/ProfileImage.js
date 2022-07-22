import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { updateUserProfileImage } from "../api/userApi";
import useApiPrivate from "../hooks/apiPrivate-hook";
import useAuth from "../hooks/auth-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ProfileImage = () => {
  const fetchApiPrivate = useApiPrivate();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [imageFile, setImageFile] = useState(null);

  const inputImageFileHandler = async (event) => {
    setImageFile(event.target.files[0]);
  };

  const saveImageHandler = async (event) => {
    const imageData = new FormData();

    imageData.append("Profile-Image", imageFile);
    await updateUserProfileImage(fetchApiPrivate, auth.user.user_id, imageData);
  };

  return (
    <ProfileImageContainer>
      <StyledFontAwesomeIcon icon={faXmark} onClick={() => navigate(-1)} />
      <h1>Profile Image</h1>
      <ImageContainer>
        <img
          src={imageFile ? URL.createObjectURL(imageFile) : auth.user.imageUrl}
          alt="profile"
        />
      </ImageContainer>
      <input type="file" accept="image/*" onChange={inputImageFileHandler} />
      <button onClick={saveImageHandler} disabled={!imageFile}>
        Save
      </button>
    </ProfileImageContainer>
  );
};

const ProfileImageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 30px;

  h1 {
    font-size: 60px;
    font-weight: 700;
    letter-spacing: 1px;
  }
`;

const ImageContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 300px;
  height: 300px;
  overflow: hidden;
  border-radius: 50%;

  img {
    width: auto;
    height: 100%;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 30px;
  padding: 5px 10px;
  position: absolute;
  top: 0;
  right: 0;

  &:hover {
    transition: all 0.2s;
    font-size: 25px;
  }
`;

export default ProfileImage;
