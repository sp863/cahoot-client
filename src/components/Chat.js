import { useEffect, useState } from "react";
import styled from "styled-components";
import { getRoom, translateMessage } from "../api/chatApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import useApiPrivate from "../hooks/apiPrivate-hook";

const Chat = ({ socket, user, chatWith, room_id, closeChat }) => {
  const fetchApiPrivate = useApiPrivate();
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [translation, setTranslation] = useState({
    message_id: "",
    message: "",
  });

  useEffect(() => {
    const getRoomData = async () => {
      const response = await getRoom(fetchApiPrivate, room_id);

      setMessageList(response.data.chats);
    };

    getRoomData();
  }, [room_id]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((previous) => [...previous, data]);
    });
  }, [socket]);

  const sendMessageHandler = async () => {
    if (!message) return;

    const messageData = {
      room: room_id,
      message,
      sentBy: user,
      sent: Date.now(),
    };

    await socket.emit("send_message", messageData);
    setMessageList((previous) => [...previous, messageData]);
    setMessage("");
  };

  const translateMessageHandler = async (event) => {
    if (!translation.message) {
      const message_id = event.target.id;
      const response = await translateMessage(fetchApiPrivate, message_id);

      setTranslation({ message_id, message: response.data });

      return;
    }

    setTranslation({
      message_id: "",
      message: "",
    });
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <p>{`${chatWith}`}</p>
        <StyledCloseIcon icon={faXmark} onClick={() => closeChat("")} />
      </ChatHeader>
      <Messages>
        {messageList.length > 0 &&
          messageList.map((message) => {
            return (
              <MessageContainer key={message._id}>
                {message.sentBy.email !== user.email ? (
                  <ReceivedMessage key={message._id}>
                    <MessageInfo isSent={false}>
                      <ProfileImage
                        src={message.sentBy.imageUrl}
                        alt={message.sentBy.name}
                      />
                      <Content
                        id={message._id}
                        onClick={translateMessageHandler}
                        isSent={false}
                      >
                        {translation.message &&
                        translation.message_id === message._id
                          ? translation.message
                          : message.message}
                      </Content>
                    </MessageInfo>
                    <Sent>
                      {new Date(message.sent).toLocaleDateString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Sent>
                  </ReceivedMessage>
                ) : (
                  <SentMessage key={message._id}>
                    <MessageInfo isSent={true}>
                      <Content
                        id={message._id}
                        onClick={translateMessageHandler}
                        isSent={true}
                      >
                        {translation.message &&
                        translation.message_id === message._id
                          ? translation.message
                          : message.message}
                      </Content>
                    </MessageInfo>
                    <Sent>
                      {new Date(message.sent).toLocaleDateString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Sent>
                  </SentMessage>
                )}
              </MessageContainer>
            );
          })}
      </Messages>
      <InputChat>
        <input
          type="text"
          placeholder="Your message..."
          onChange={(event) => setMessage(event.target.value)}
          value={message}
        />
        <SendContainer>
          <StyledSendIcon icon={faPaperPlane} onClick={sendMessageHandler} />
        </SendContainer>
      </InputChat>
    </ChatContainer>
  );
};

export default Chat;

const ChatContainer = styled.div`
  display: grid;
  grid-template-rows: 7% 73% 20%;
  height: 690px;
`;

const ChatHeader = styled.div`
  background-color: var(--primary-color);
  position: relative;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;

  p {
    font-size: 20px;
    font-weight: 500;
    margin-left: 20px;
  }
`;

const MessageInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isSent ? "end" : "start")};
  padding: 10px;
  gap: 10px;
`;

const Messages = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReceivedMessage = styled.div`
  align-self: flex-start;
`;

const SentMessage = styled.div`
  align-self: flex-end;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Content = styled.div`
  cursor: pointer;
  background-color: ${(props) => (props.isSent ? "#339af0" : "#20c997")};
  color: white;
  padding: 10px;
  font-size: 20px;
  display: inline-block;
  border-radius: 7px;
  z-index: 10;
`;

const Sent = styled.div`
  font-size: 15px;
  font-weight: 500;
  padding: 0px 10px;
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 20px;
  padding: 5px 10px;
  color: white;
  position: absolute;
  top: 25%;
  right: 0;

  &:hover {
    transition: all 0.2s;
    font-size: 25px;
  }
`;

const InputChat = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;

  input {
    border: none;
    border-top: solid 2px #ced4da;
    font-size: 20px;
  }
`;

const SendContainer = styled.div`
  border-top: solid 2px #ced4da;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSendIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 30px;
  padding: 20px;
  background-color: #ced4da;
  border-radius: 5px;

  &:hover {
    transition: all 0.2s;
    background-color: #4dabf7;
  }
`;
