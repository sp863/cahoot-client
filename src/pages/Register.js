import { useRef, useState, useEffect } from "react";
import {
  PASSWORD_VALIDATION_REGEX,
  EMAIL_VALIDATION_REGEX,
} from "../constants/constants";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { createUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const lastNameRef = useRef();
  const errorRef = useRef();

  const [name, setName] = useState("");
  const [isFocusOnName, setIsFocusOnName] = useState(false);

  const [organization, setOrganization] = useState("");

  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isFocusOnEmail, setIsFocusOnEmail] = useState(false);

  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isFocusOnPassword, setIsFocusOnPassword] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [isValidMatch, setIsValidMatch] = useState(false);
  const [isFocusOnMatch, setIsFocusOnMatch] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    lastNameRef.current.focus();
  }, []);

  useEffect(() => {
    setIsValidEmail(EMAIL_VALIDATION_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setIsValidPassword(PASSWORD_VALIDATION_REGEX.test(password));
    setIsValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrorMessage("");
  }, [email, password, matchPassword]);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      await createUser({
        name,
        organization,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("No Server Response");
      } else if (error.response?.status === 409) {
        setErrorMessage("Username Taken");
      } else {
        setErrorMessage("Registration Failed");
      }
      errorRef.current.focus();
    }
  };

  return (
    <RegisterSection>
      <ErrorMessage
        ref={errorRef}
        className={errorMessage ? "error-message" : "hide"}
      >
        {errorMessage}
      </ErrorMessage>
      <h1>Sign Up</h1>
      <RegisterForm onSubmit={submitHandler}>
        <InputSection>
          <UserInput>
            <label htmlFor="name">Name</label>
            <input
              ref={lastNameRef}
              type="text"
              id="name"
              autoComplete="off"
              onChange={(event) => setName(event.target.value)}
              value={name}
              aria-invalid={name ? "false" : "true"}
              aria-describedby="lastnameinstructions"
              onFocus={() => setIsFocusOnName(true)}
              onBlur={() => setIsFocusOnName(false)}
              required
            />
          </UserInput>
          <Instructions
            id="lastnameinstructions"
            className={isFocusOnName && !name ? "instructions" : "hide"}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Name Required
          </Instructions>
        </InputSection>
        <InputSection>
          <UserInput>
            <label htmlFor="organization">Organization</label>
            <input
              type="text"
              id="organization"
              autoComplete="off"
              onChange={(event) => setOrganization(event.target.value)}
              value={organization}
              aria-invalid={organization ? "false" : "true"}
              aria-describedby="organizationinstructions"
            />
          </UserInput>
        </InputSection>
        <InputSection>
          <UserInput>
            <label htmlFor="email">
              Email
              <FontAwesomeIcon
                icon={faCheck}
                className={isValidEmail ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={isValidEmail || !email ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="email"
              autoComplete="off"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              aria-invalid={isValidEmail ? "false" : "true"}
              aria-describedby="emailinstructions"
              onFocus={() => setIsFocusOnEmail(true)}
              onBlur={() => setIsFocusOnEmail(false)}
              required
            />
          </UserInput>
          <Instructions
            id="emailinstructions"
            className={
              isFocusOnEmail && email && !isValidEmail ? "instructions" : "hide"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Invalid Email
          </Instructions>
        </InputSection>
        <InputSection>
          <UserInput>
            <label htmlFor="password">
              Password
              <FontAwesomeIcon
                icon={faCheck}
                className={isValidPassword ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={isValidPassword || !password ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              aria-invalid={isValidPassword ? "false" : "true"}
              aria-describedby="passwordinstructions"
              onFocus={() => setIsFocusOnPassword(true)}
              onBlur={() => setIsFocusOnPassword(false)}
              required
            />
          </UserInput>
          <Instructions
            id="pwdnote"
            className={
              isFocusOnPassword && !isValidPassword ? "instructions" : "hide"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
            <br />
            Allowed special characters:{" "}
            <span aria-label="exclamation mark">!</span>{" "}
            <span aria-label="at symbol">@</span>{" "}
            <span aria-label="hashtag">#</span>{" "}
            <span aria-label="dollar sign">$</span>{" "}
            <span aria-label="percent">%</span>
          </Instructions>
        </InputSection>
        <InputSection>
          <UserInput>
            <label htmlFor="confirm_pwd">
              Confirm Password
              <FontAwesomeIcon
                icon={faCheck}
                className={isValidMatch && matchPassword ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={isValidMatch || !matchPassword ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPassword(e.target.value)}
              value={matchPassword}
              required
              aria-invalid={isValidMatch ? "false" : "true"}
              aria-describedby="confirminstructions"
              onFocus={() => setIsFocusOnMatch(true)}
              onBlur={() => setIsFocusOnMatch(false)}
            />
          </UserInput>
          <Instructions
            id="confirmnoteinstructions"
            className={
              isFocusOnMatch && !isValidMatch ? "instructions" : "hide"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Passwords must match.
          </Instructions>
        </InputSection>
        <button
          disabled={
            !name || !isValidEmail || !isValidPassword || !isValidMatch
              ? true
              : false
          }
        >
          Sign Up
        </button>
      </RegisterForm>
      <LoginSection>
        Already have an account?
        <Link to="/login"> Sign In</Link>
      </LoginSection>
    </RegisterSection>
  );
};

export default Register;

const RegisterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 40px;

  h1 {
    font-size: 80px;
    font-weight: 500;
  }

  button {
    width: 50%;
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

  .hide {
    display: none;
  }
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const UserInput = styled.div`
  display: grid;
  grid-template-columns: 30% 70%;
  width: 500px;

  label {
    text-align: right;
    margin-right: 10px;
  }

  input {
    height: 25px;
    width: 80%;
  }
`;

const Instructions = styled.p`
  width: 300px;
  font-size: 15px;
`;

const ErrorMessage = styled.p`
  font-size: 25px;
  font-weight: 500px;
  color: red;
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const LoginSection = styled.p`
  a {
    text-decoration: underline;

    &:hover {
      transition: all 0.3s;
      color: red;
    }
  }
`;
