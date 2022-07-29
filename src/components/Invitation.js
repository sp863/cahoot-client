import { useState } from "react";
import { sendInvitationEmail } from "../api/projectApi";
import useAuth from "../hooks/auth-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const Invitation = ({ fetchApiPrivate, project_id, closeModal }) => {
  const { auth } = useAuth();
  const [email, setEmail] = useState("");

  const sendInvitationEmailHandler = async () => {
    const emailData = {
      fromUser: auth.user.name,
      from: auth.user.email,
      to: email,
    };

    await sendInvitationEmail({ fetchApiPrivate, project_id, emailData });
    closeModal(false);
  };
  return (
    <InvitationContainer>
      <StyledCloseIcon icon={faXmark} onClick={() => closeModal(false)} />
      <h1>Send invitation to...</h1>
      <Form>
        <UserInput>
          <label htmlFor="invite-email">Email</label>
          <input
            id="invite-email"
            type="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </UserInput>
        <button onClick={sendInvitationEmailHandler}>Send</button>
      </Form>
    </InvitationContainer>
  );
};

const InvitationContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  position: relative;

  h1 {
    font-size: 25px;
    margin-top: 60px;
    font-weight: 500;
  }
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 20px;
  padding: 5px 10px;
  color: var(--primary_color);
  position: absolute;
  top: -2%;
  right: -2%;

  &:hover {
    transition: all 0.2s;
    font-size: 25px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;

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

    &:disabled {
      background-color: #adb5bd;
      color: #868e96;
    }

    &[disabled]:hover {
      background-color: #adb5bd;
      color: #868e96;
    }
  }
`;

const UserInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;

  label {
    font-size: 20px;
  }

  input {
    width: 70%;
    height: 30px;
  }
`;

export default Invitation;
