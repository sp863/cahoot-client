import styled from "styled-components";
import HomeSignature from "../components/HomeSignature";
import home2 from "../img/home2.jpg";

const Home = () => {
  return (
    <HomeContainer>
      <HomeMain>
        <PageTitle>
          <HomeSignature />
          <h1>SIGN.</h1>
          <h1>FACE ID.</h1>
          <h1>TRANSLATE.</h1>
        </PageTitle>
      </HomeMain>
    </HomeContainer>
  );
};

const HomeContainer = styled.div``;

const HomeMain = styled.div`
  background-image: url(${home2});
  background-repeat: no-repeat;
  background-size: 100%;
  width: 100%;
  height: 91vh;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  &:after {
    content: "";
    background: rgba(33, 37, 41, 0.6);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
`;

const PageTitle = styled.div`
  position: absolute;
  z-index: 5;
  display: flex;
  flex-direction: column;

  h1 {
    color: white;
    font-weight: 700;
    font-size: 90px;
    letter-spacing: 3px;
  }
`;

export default Home;
