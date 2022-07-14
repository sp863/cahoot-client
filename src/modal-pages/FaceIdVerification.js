import { useNavigate } from "react-router";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getUserFaceId, verifyFaceId } from "../api/userApi";
import { FACE_MODEL_URL } from "../constants/constants";
import { Link } from "react-router-dom";

const FaceIdVerification = ({ user, fetchApiPrivate, completeStep }) => {
  const webcamElement = useRef();
  const [isVerified, setIsVerified] = useState(false);

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
  };

  const loadLabeledImages = async () => {
    const response = await getUserFaceId(fetchApiPrivate, user.user_id);
    console.log(response);
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
    <div>
      <h1>Step 1</h1>
      {isVerified && <h2>Verified!</h2>}
      <p>No Face ID? </p>
      <Link to={`/profile/${user.user_id}/faceid`}>Register here</Link>
      <Webcam
        ref={webcamElement}
        height={480}
        width={640}
        screenshotFormat="image/png"
      />
      <button onClick={verifyFaceHandler} disabled={isVerified}>
        Verify
      </button>
      <button onClick={faceIdVerified} disabled={!isVerified}>
        Next
      </button>
    </div>
  );
};

export default FaceIdVerification;
