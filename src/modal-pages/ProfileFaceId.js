import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";
import styled from "styled-components";
import { registerUserFaceId } from "../api/userApi";
import useApiPrivate from "../hooks/apiPrivate-hook";
import useAuth from "../hooks/auth-hook";
import useInterval from "../hooks/interval-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ProfileFaceId = () => {
  const fetchApiPrivate = useApiPrivate();
  const { auth } = useAuth();

  const [faceId, setFaceId] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(1);
  const [isStarted, setIsStarted] = useState(false);

  const webcamElement = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (faceId.length === 3) {
      registerFaceId(faceId);
    }
  }, [faceId]);

  useInterval(
    () => {
      if (timeRemaining % 5 === 0 && timeRemaining > 0 && timeRemaining < 16) {
        captureFace();
      }
      setTimeRemaining(timeRemaining + 1);
    },
    isStarted ? 1000 : null
  );

  const captureFace = () => {
    const screenShotImage = webcamElement.current.getScreenshot();

    setFaceId([...faceId, screenShotImage]);
  };

  const registerFaceId = async (faceId) => {
    const faceData = new FormData();

    for (const [index, base64FaceData] of faceId.entries()) {
      const response = await fetch(base64FaceData);
      const imageBlob = await response.blob();
      imageBlob.name = `face-image-${index}.png`;
      imageBlob.lastModifiend = new Date();

      const imageFile = new File([imageBlob], `face-image-${index}.png`, {
        type: "image/png",
      });

      faceData.append("newFaceID", imageFile);
    }

    try {
      await registerUserFaceId(fetchApiPrivate, auth.user.user_id, faceData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProfileFaceIdContainer>
      <StyledFontAwesomeIcon icon={faXmark} onClick={() => navigate(-1)} />
      <RemainingTimeContainer>
        {isStarted && timeRemaining < 16 && (
          <>
            <Time>
              {timeRemaining > 10
                ? 15 - timeRemaining + 1
                : timeRemaining > 5
                ? 10 - timeRemaining + 1
                : 5 - timeRemaining + 1}
            </Time>
            {timeRemaining % 5 === 0 && (
              <CapturedMessage>Captured!</CapturedMessage>
            )}
          </>
        )}
      </RemainingTimeContainer>
      <Webcam
        ref={webcamElement}
        height={480}
        width={640}
        screenshotFormat="image/png"
      />
      <button onClick={() => setIsStarted(true)} disabled={isStarted}>
        Register Face ID
      </button>
    </ProfileFaceIdContainer>
  );
};

const ProfileFaceIdContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;

  button {
    border: none;
    border-radius: 5px;
    height: 50px;
    width: 150px;
    background-color: var(--primary-color);
    color: white;
    font-size: 15px;
    cursor: pointer;
    font-family: "Montserrat", sans-serif;

    &:hover {
      transition: all 0.3s;
      color: white;
      background-color: #69db7c;
    }

    &:disabled {
      background-color: #adb5bd;
      color: #868e96;
    }

    &[disabled]:hover {
      background-color: #adb5bd;
      color: #868e96;
    }
  }
`;

const RemainingTimeContainer = styled.div`
  height: 70px;
  margin-top: 30px;
`;

const Time = styled.div`
  color: red;
  font-weight: 700;
  font-size: 50px;
`;

const CapturedMessage = styled.div`
  position: absolute;
  top: 30%;
  right: 10%;
  font-size: 60px;
  font-weight: 700;
  color: #f76707;
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

export default ProfileFaceId;
