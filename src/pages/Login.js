import { useState, useEffect, useRef } from "react";
import { loginUser } from "../api/authApi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/auth-hook";

const Login = () => {
  const { setAuth } = useAuth();

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

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await loginUser(email, password);
      console.log(response);

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
        setErrorMessage("Missing Username or Password");
      } else if (error.response?.status === 401) {
        setErrorMessage("Unauthorized");
      } else {
        setErrorMessage("Login Failed");
      }
      errorRef.current.focus();
    }
  };

  return (
    <section>
      <p ref={errorRef} aria-live="assertive">
        {errorMessage}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={submitHandler}>
        <label htmlFor="email">Email</label>
        <input
          ref={emailRef}
          type="email"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
          required
        />
        <button>Sign In</button>
        <p>
          Need an Account?
          <Link to="/register"> Register here</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
