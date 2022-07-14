import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";
import styled from "styled-components";
import { registerUserFaceId } from "../api/userApi";
import ModalPage from "../components/ModalPage";
import useApiPrivate from "../hooks/apiPrivate-hook";
import useAuth from "../hooks/auth-hook";
import useInterval from "../hooks/interval-hook";

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
      console.log("register!!!");
    }
  }, [faceId]);

  useInterval(
    () => {
      if (timeRemaining % 5 === 0 && timeRemaining > 0 && timeRemaining < 16) {
        captureFace();
        console.log("captured");
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
    <ModalPage>
      <button onClick={() => navigate(-1)}>X</button>
      {isStarted && timeRemaining < 16 && (
        <>
          <div>
            {timeRemaining > 10
              ? 15 - timeRemaining + 1
              : timeRemaining > 5
              ? 10 - timeRemaining + 1
              : 5 - timeRemaining + 1}
          </div>
          {/* {timeRemaining % 5 === 0 && <div>Captured!</div>} */}
        </>
      )}
      <Webcam
        ref={webcamElement}
        height={480}
        width={640}
        screenshotFormat="image/png"
      />
      <button onClick={() => setIsStarted(true)} disabled={isStarted}>
        Register Face ID
      </button>
    </ModalPage>
  );
};

export default ProfileFaceId;
