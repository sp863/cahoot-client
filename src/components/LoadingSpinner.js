import styled from "styled-components";

const LoadingSpinner = ({ right, top }) => {
  return (
    <SpinnerContainer right={right} top={top}>
      <div className="loading-spinner"></div>
    </SpinnerContainer>
  );
};

const SpinnerContainer = styled.div`
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 10px solid #f3f3f3;
    border-top: 10px solid var(--primary-color);
    border-radius: 50%;
    animation: spinner 1.5s linear infinite;
    position: absolute;
    right: ${(props) => props.right};
    top: ${(props) => props.top};
  }

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default LoadingSpinner;
