import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import { registerUserFaceId } from "../api/userApi";
import useInterval from "../hooks/interval-hook";

const ProfileFaceID = () => {
  const [faceId, setFaceId] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(37);
  const webcamElement = useRef();

  useEffect(() => {
    if (faceId.length === 3) {
      registerFaceId(faceId);
    }
  }, [faceId]);

  useInterval(() => {
    if (timeRemaining % 10 === 0 && timeRemaining > 0) {
      captureFace();
      console.log("captured");
    }
    setTimeRemaining(timeRemaining - 1);
  }, 500);

  const captureFace = () => {
    const screenShotImage = webcamElement.current.getScreenshot();

    setFaceId([...faceId, screenShotImage]);
  };

  const registerFaceId = async (faceId) => {
    const data = new FormData();

    for (const base64FaceData of faceId) {
      const response = await fetch(base64FaceData);
      const imageBlob = await response.blob();
      imageBlob.name = `face-image.png`;
      imageBlob.lastModifiend = new Date();

      const imageFile = new File([imageBlob], `face-image.png`, {
        type: "image/png",
      });

      data.append("image", imageFile);
    }

    try {
      const response = await registerUserFaceId(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Webcam
        ref={webcamElement}
        height={480}
        width={640}
        screenshotFormat="image/png"
      />
    </div>
  );
};

export default ProfileFaceID;
