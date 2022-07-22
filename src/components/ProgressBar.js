import { useEffect, useState } from "react";
import styled from "styled-components";

const ProgressBar = ({ tasks }) => {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    setCompleted(0);

    if (!tasks) return;

    tasks.forEach((task) => {
      if (task.status === "Completed") {
        setCompleted((previous) => previous + 1);
      }
    });
  }, [tasks]);

  return (
    <BarContainer>
      <BarFiller
        completed={
          tasks?.length > 0
            ? `${Math.trunc((completed / tasks?.length) * 100)}%`
            : "0"
        }
      >
        <Label>{`${Math.trunc((completed / tasks?.length) * 100)}%`}</Label>
      </BarFiller>
    </BarContainer>
  );
};

const BarContainer = styled.div`
  width: 90%;
  height: 40%;
  border-radius: 10px;
  box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.25), -6px -3px 8px rgba(0, 0, 0, 0.25);
`;

const BarFiller = styled.div`
  height: 100%;
  width: ${(props) => props.completed};
  background-color: #099268;
  position: relative;
  border-radius: inherit;
  transition: 3s ease-in-out;
`;

const Label = styled.span`
  font-size: 20px;
  font-weight: 700;
  position: absolute;
  padding: 0px 20px;
  top: 25%;
  right: 0;
  color: white;
`;

export default ProgressBar;
