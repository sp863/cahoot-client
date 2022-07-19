import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { updateUserProfileImage } from "../api/userApi";
import useApiPrivate from "../hooks/apiPrivate-hook";
import useAuth from "../hooks/auth-hook";

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
      <button onClick={() => navigate(-1)}>Back</button>
      <h1>Profile Image</h1>
      <ImageContainer class="circular--portrait">
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

export default ProfileImage;
