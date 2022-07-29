import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getUserFaceId } from "../api/userApi";
import { FACE_MODEL_URL } from "../constants/constants";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../components/LoadingSpinner";

const FaceIdVerification = ({ user, fetchApiPrivate, completeStep }) => {
  const webcamElement = useRef();
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.faceRecognitionNet.loadFromUri(FACE_MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(FACE_MODEL_URL);
      await faceapi.nets.ssdMobilenetv1.loadFromUri(FACE_MODEL_URL);
    };

    webcamElement.current && loadModels();
  }, [webcamElement]);

  const faceIdVerified = () => {
    completeStep((previous) => previous + 1);
  };

  const verifyFaceHandler = async () => {
    setIsVerifying(true);

    const capturedImage = webcamElement.current.getScreenshot();
    const response = await fetch(capturedImage);
    const imageBlob = await response.blob();
    const image = await faceapi.bufferToImage(imageBlob);

    const labeledFaceDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    const detections = await faceapi
      .detectAllFaces(image)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const results = detections.map((detection) =>
      faceMatcher.findBestMatch(detection.descriptor)
    );

    if (results[0]._label === user.email) {
      setIsVerified(true);
    }

    setIsVerifying(false);
  };

  const loadLabeledImages = async () => {
    const response = await getUserFaceId(fetchApiPrivate, user.user_id);
    const faceIdUrls = response.data;
    const descriptions = [];
    for (const url of faceIdUrls) {
      const image = await faceapi.fetchImage(url);
      const detections = await faceapi
        .detectSingleFace(image)
        .withFaceLandmarks()
        .withFaceDescriptor();
      descriptions.push(detections.descriptor);
    }

    return new faceapi.LabeledFaceDescriptors(user.email, descriptions);
  };

  return (
    <FaceIDContainer>
      <Step>
        <p>Step 1</p>
        {isVerified && <StyledVerifiedIcon icon={faCircleCheck} />}
        {isVerifying && <LoadingSpinner right="-70%" top="-20%" />}
      </Step>
      <Instructions>
        <p>No Face ID? </p>
        <StyledLink to={`/profile/${user.user_id}/faceid`}>
          Register here
        </StyledLink>
      </Instructions>
      <Webcam
        ref={webcamElement}
        height={480}
        width={640}
        screenshotFormat="image/png"
      />
      <button onClick={verifyFaceHandler} disabled={isVerified || isVerifying}>
        Verify
      </button>
      <NextButton onClick={faceIdVerified} disabled={!isVerified}>
        Next
      </NextButton>
    </FaceIDContainer>
  );
};

const FaceIDContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;

  button {
    padding: 5px 20px;
    border: none;
    border-radius: 5px;
    height: 50px;
    width: 80px;
    background-color: var(--primary-color);
    color: white;
    font-size: 15px;
    cursor: pointer;

    &:hover {
      transition: all 0.2s;
      color: var(--primary-color);
      background-color: #69db7c;
    }

    &:disabled {
      background-color: #e9ecef;
    }
  }
`;

const NextButton = styled.button`
  position: absolute;
  right: 0;
  bottom: 0;
`;

const Step = styled.div`
  position: relative;

  p {
    font-size: 40px;
    font-weight: 700;
  }
`;

const StyledVerifiedIcon = styled(FontAwesomeIcon)`
  font-size: 50px;
  position: absolute;
  right: -70%;
  top: -20%;
  transition: all 0.3s;
  color: #51cf66;
`;

const Instructions = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledLink = styled(Link)`
  padding: 0px 10px;
  border-radius: 5px;
  text-decoration: underline;

  &:hover {
    transition: all 0.2s;
    color: red;
  }
`;

export default FaceIdVerification;
