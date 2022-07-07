import styled from "styled-components";

const ModalPage = ({ children }) => {
  return (
    <ModalContainer>
      <Content>{children}</Content>;
    </ModalContainer>
  );
};

export default ModalPage;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  width: 85%;
  height: 85%;
  padding: 30px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
`;
