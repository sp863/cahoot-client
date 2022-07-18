import { useState } from "react";
import { sendInvitationEmail } from "../api/projectApi";
import useAuth from "../hooks/auth-hook";

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
    <div>
      <div>Send invitation to...</div>
      <label htmlFor="invite-email">Email</label>
      <input
        id="invite-email"
        type="email"
        onChange={(event) => setEmail(event.target.value)}
      />
      <button onClick={sendInvitationEmailHandler}>Send</button>
      <button onClick={() => closeModal(false)}>X</button>
    </div>
  );
};

export default Invitation;
