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
import { Link } from "react-router-dom";

const PageRegister = () => {
  const lastNameRef = useRef();
  const errorRef = useRef();

  const [organization, setOrganization] = useState("");
  const [isFocusOnOrganization, setIsFocusOnOrganization] = useState(false);

  const [lastName, setLastName] = useState("");
  const [isFocusOnLastName, setIsFocusOnLastName] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [isFocusOnFirstName, setIsFocusOnFirstName] = useState(false);

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
      const response = await createUser();
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
      <p
        ref={errorRef}
        aria-live="assertive"
        className={errorMessage ? "error-message" : "hide"}
      >
        {errorMessage}
      </p>
      <h1>Sign Up</h1>
      <form onSubmit={submitHandler}>
        <label htmlFor="last-name">Last Name:</label>
        <input
          ref={lastNameRef}
          type="text"
          id="last-name"
          autoComplete="off"
          onChange={(event) => setLastName(event.target.value)}
          value={lastName}
          aria-invalid={lastName ? "false" : "true"}
          aria-describedby="lastnameinstructions"
          onFocus={() => setIsFocusOnLastName(true)}
          onBlur={() => setIsFocusOnLastName(false)}
          required
        />
        <p
          id="lastnameinstructions"
          className={isFocusOnLastName && !lastName ? "instructions" : "hide"}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Last Name Required
        </p>

        <label htmlFor="first-name">First Name:</label>
        <input
          type="text"
          id="first-name"
          autoComplete="off"
          onChange={(event) => setFirstName(event.target.value)}
          value={firstName}
          aria-invalid={firstName ? "false" : "true"}
          aria-describedby="firstnameinstructions"
          onFocus={() => setIsFocusOnFirstName(true)}
          onBlur={() => setIsFocusOnFirstName(false)}
          required
        />
        <p
          id="firstnameinstructions"
          className={isFocusOnFirstName && !firstName ? "instructions" : "hide"}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          First Name Required
        </p>

        <label htmlFor="organization">Organization:</label>
        <input
          type="text"
          id="organization"
          autoComplete="off"
          onChange={(event) => setOrganization(event.target.value)}
          value={organization}
          aria-invalid={organization ? "false" : "true"}
          aria-describedby="organizationinstructions"
          onFocus={() => setIsFocusOnOrganization(true)}
          onBlur={() => setIsFocusOnOrganization(false)}
          required
        />
        <p
          id="organizationinstructions"
          className={
            isFocusOnOrganization && !organization ? "instructions" : "hide"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Organization Required
        </p>

        <label htmlFor="email">
          Email:
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
        <p
          id="emailinstructions"
          className={
            isFocusOnEmail && email && !isValidEmail ? "instructions" : "hide"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Invalid Email
        </p>

        <label htmlFor="password">
          Password:
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
        <p
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
        </p>

        <label htmlFor="confirm_pwd">
          Confirm Password:
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
        <p
          id="confirmnoteinstructions"
          className={isFocusOnMatch && !isValidMatch ? "instructions" : "hide"}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Passwords must match.
        </p>
        <button
          disabled={
            !lastName ||
            !firstName ||
            !organization ||
            !isValidEmail ||
            !isValidPassword ||
            !isValidMatch
              ? true
              : false
          }
        >
          Next
        </button>
      </form>
      <p>
        Already have an account?
        <span className="line">{/* <Link to="/login">Sign In</Link> */}</span>
      </p>
    </RegisterSection>
  );
};

export default PageRegister;

const RegisterSection = styled.div`
  .hide {
    display: none;
  }
`;
