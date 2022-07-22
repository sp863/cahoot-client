import ModalPortal from "./Portal";
import styled from "styled-components";

const ModalProfile = ({ children }) => {
  return (
    <ModalPortal>
      <Content>{children}</Content>
    </ModalPortal>
  );
};

export default ModalProfile;

const Content = styled.div`
  position: fixed;
  top: 9%;
  right: 1%;
  width: 200px;
  height: 170px;
  background-color: white;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  z-index: 99;
`;
