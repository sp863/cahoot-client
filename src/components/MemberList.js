import styled from "styled-components";
import useAuth from "../hooks/auth-hook";
import io from "socket.io-client";
import envKeys from "../config/config";
import { useState } from "react";
import Chat from "./Chat";
import { useQuery } from "react-query";
import { getRoomsByUsers } from "../api/chatApi";

const socket = io.connect(envKeys.REACT_APP_BACKEND_URL, {
  withCredientials: true,
});

const MemberList = ({ fetchApiPrivate, members, rooms, projectUrl }) => {
  const { auth } = useAuth();
  const [currentChatRoom, setCurrentChatRoom] = useState("");
  const { data: roomsByUsers } = useQuery(["projects", rooms, members], () =>
    getRoomsByUsers({
      fetchApiPrivate,
      rooms: rooms?.map((room) => room._id),
      user_id: auth.user.user_id,
      members: members?.map((member) => member._id),
    })
  );

  const joinChatHandler = async (event) => {
    const room_id = event.target.id;

    if (!room_id) return;

    socket.emit("join_room", room_id);
    setCurrentChatRoom(room_id);
  };

  if (currentChatRoom) {
    return (
      <Chat
        fetchApiPrivate={fetchApiPrivate}
        socket={socket}
        user={auth.user}
        room_id={currentChatRoom}
        closeChat={setCurrentChatRoom}
      />
    );
  }

  return (
    <MembersSection>
      <MemberCard>
        <Member>
          <MemberImage src={auth.user.imageUrl} alt={auth.user.name} />
          <div>{auth.user.name}</div>
        </Member>
      </MemberCard>
      <div>github</div>
      {members &&
        members
          .filter((member) => member.email !== auth.user.email)
          .map((member, index) => {
            return (
              <MemberCard key={member._id}>
                <Member>
                  <MemberImage src={member.imageUrl} alt={member.name} />
                  <div>{member.name}</div>
                </Member>
                <MemberResource>
                  <ChatIcon
                    onClick={joinChatHandler}
                    id={roomsByUsers?.data[index]}
                    name={member._id}
                  >
                    Chat Icon
                  </ChatIcon>
                  <div>Signed Documents Icon</div>
                </MemberResource>
              </MemberCard>
            );
          })}
    </MembersSection>
  );
};

const MembersSection = styled.div`
  background-color: blueviolet;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 50% 50%;
`;

const MemberCard = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const Member = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const MemberImage = styled.img``;

const ChatIcon = styled.div`
  cursor: pointer;
`;

const MemberResource = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-content: center;
`;

export default MemberList;
