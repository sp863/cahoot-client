import { useEffect, useState } from "react";
import styled from "styled-components";
import { getRoom, translateMessage } from "../api/chatApi";

const Chat = ({ fetchApiPrivate, socket, user, room_id, closeChat }) => {
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
        <button onClick={() => closeChat("")}>X</button>
      </ChatHeader>
      <Messages>
        {messageList.length > 0 &&
          messageList.map((message) => {
            return (
              <MessageContainer key={message._id}>
                {message.sentBy.email !== user.email ? (
                  <ReceivedMessage>
                    <ProfileImage
                      src={message.sentBy.imageUrl}
                      alt={message.sentBy.name}
                    />
                    <Info>{message.sentBy.name}</Info>
                    <Content id={message._id} onClick={translateMessageHandler}>
                      {translation.message &&
                      translation.message_id === message._id
                        ? translation.message
                        : message.message}
                    </Content>
                    <Sent>
                      {new Date(message.sent).toLocaleDateString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Sent>
                  </ReceivedMessage>
                ) : (
                  <SentMessage>
                    <Content id={message._id} onClick={translateMessageHandler}>
                      {translation.message &&
                      translation.message_id === message._id
                        ? translation.message
                        : message.message}
                    </Content>
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
        <button onClick={sendMessageHandler}>Send</button>
      </InputChat>
    </ChatContainer>
  );
};

export default Chat;

const ChatContainer = styled.div`
  display: grid;
  grid-template-rows: 7% 73% 20%;
`;

const ChatHeader = styled.div`
  background-color: black;
`;

const Messages = styled.div`
  background-color: brown;
`;

const MessageContainer = styled.div``;

const ReceivedMessage = styled.div``;

const SentMessage = styled.div``;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Content = styled.div`
  cursor: pointer;
  background-color: grey;
  padding: 10px;
  display: inline-block;
  border-radius: 7px;
  z-index: 10;
`;

const Info = styled.div`
  height: 50px;
  background-color: antiquewhite;
`;

const Sent = styled.div``;

const InputChat = styled.div`
  background-color: lightgoldenrodyellow;
`;
