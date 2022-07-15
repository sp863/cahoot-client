import ModalPortal from "./Portal";
import styled from "styled-components";

const Modal = ({ children }) => {
  return (
    <ModalPortal>
      <Content>{children}</Content>
    </ModalPortal>
  );
};

export default Modal;
//top, left, width, height
const Content = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 35%;
  height: 60%;
  background-color: beige;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  z-index: 99;
`;
