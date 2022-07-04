import { useState, useEffect, useRef } from "react";

const PageLogin = () => {
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMessage("");
  }, [email, password]);

  const inputEmailHandler = (event) => {};
  const inputPasswordHandler = (event) => {};

  return (
    <section>
      <p ref={errRef} aria-live="assertive">
        {errorMessage}
      </p>
      <h1>Sign In</h1>
      <form>
        <label htmlFor="email">Email</label>
        <input
          ref={emailRef}
          type="email"
          id="email"
          onChange={inputEmailHandler}
          value={email}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={inputPasswordHandler}
          value={password}
          required
        />
        <p>Need an Account?</p>
        <button>Sign In</button>
      </form>
    </section>
  );
};

export default PageLogin;
