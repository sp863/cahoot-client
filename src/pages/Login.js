import { useState, useEffect, useRef } from "react";
import { loginUser } from "../api/authApi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/auth-hook";
import styled from "styled-components";

const Login = () => {
  const { persist, setAuth, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const emailRef = useRef();
  const errorRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMessage("");
  }, [email, password]);

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await loginUser(email, password);

      const user = response?.data?.user;
      const accessToken = response?.data?.accessToken;

      setAuth({ user, accessToken });
      setEmail("");
      setPassword("");

      navigate(from, { replace: true });
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("No Server Response");
      } else if (error.response?.status === 400) {
        setErrorMessage("Invalid Username or Password");
      } else if (error.response?.status === 401) {
        setErrorMessage("Unauthorized");
      } else {
        setErrorMessage("Login Failed");
      }
      errorRef.current.focus();
    }
  };

  return (
    <LoginMain>
      <ErrorMessage ref={errorRef}>{errorMessage}</ErrorMessage>
      <h1>Sign In</h1>
      <LoginForm onSubmit={submitHandler}>
        <UserInput>
          <label htmlFor="email">Email</label>
          <input
            ref={emailRef}
            type="email"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            required
          />
        </UserInput>
        <UserInput>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            required
          />
        </UserInput>
        <button>Sign In</button>
        <PersistSection>
          <input
            id="persist"
            type="checkbox"
            onChange={() => setPersist((prev) => !prev)}
            checked={persist ? true : false}
          />
          <label htmlFor="persist">Trust this device.</label>
        </PersistSection>

        <RegisterSection>
          Need an Account?
          <Link to="/register"> Register here</Link>
        </RegisterSection>
      </LoginForm>
    </LoginMain>
  );
};

const LoginMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 40px;

  h1 {
    font-size: 85px;
    font-weight: 500;
    margin-bottom: 30px;
  }

  button {
    width: 80%;
    padding: 10px;
    border: solid 1px var(--primary-color);
    background-color: var(--primary-color);
    color: white;
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      background-color: white;
      border: solid 1px var(--primary-color);
      transition: all 0.3s;
      color: var(--primary-color);
    }
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
`;

const ErrorMessage = styled.p`
  font-size: 25px;
  font-weight: 500px;
  color: red;
`;

const UserInput = styled.div`
  display: grid;
  grid-template-columns: 30% 70%;

  width: 300px;

  label {
    text-align: right;
    margin-right: 10px;
  }

  input {
    height: 25px;
  }
`;

const PersistSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const RegisterSection = styled.p`
  a {
    text-decoration: underline;

    &:hover {
      transition: all 0.3s;
      color: red;
    }
  }
`;

export default Login;
