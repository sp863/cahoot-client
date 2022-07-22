import styled from "styled-components";
import useAuth from "../hooks/auth-hook";
import io from "socket.io-client";
import envKeys from "../config/config";
import { useState } from "react";
import Chat from "./Chat";
import { useQuery } from "react-query";
import { getRoomsByUsers } from "../api/chatApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faFileLines } from "@fortawesome/free-regular-svg-icons";
import github from "../img/github.jpeg";
import { Link } from "react-router-dom";

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
    <ListContainer>
      <Github>
        <img src={github} alt="github" />
        <Link to="www.google.com" target="_blank">
          Project Github Link
        </Link>
      </Github>
      <h1>Your Team</h1>
      <MembersSection>
        {members &&
          members
            .filter((member) => member.email !== auth.user.email)
            .map((member, index) => {
              return (
                <MemberCard key={member._id}>
                  <Member>
                    <ImageContainer>
                      <img src={member.imageUrl} alt={member.name} />
                    </ImageContainer>
                    <p>{member.name}</p>
                  </Member>
                  <MemberResource>
                    <StyledFontAwesomeIcon
                      icon={faComments}
                      onClick={joinChatHandler}
                      id={roomsByUsers?.data[index]}
                      name={member._id}
                    />
                    <StyledFontAwesomeIcon
                      icon={faFileLines}
                      // id={roomsByUsers?.data[index]}
                      // name={member._id}
                    />
                  </MemberResource>
                </MemberCard>
              );
            })}
      </MembersSection>
    </ListContainer>
  );
};

const ListContainer = styled.div`
  display: grid;
  grid-template-rows: 10% 5% 85%;

  h1 {
    margin-top: 30px;
    text-align: center;
    font-size: 30px;
    font-weight: 500;
  }
`;

const MembersSection = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr;
`;

const Github = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  img {
    height: 80px;
  }

  a {
    font-size: 20px;
    text-decoration: underline;

    &:hover {
      color: red;
    }
  }
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

  p {
    font-weight: 700;
  }
`;

const ImageContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;

  img {
    width: 100%;
    height: 100%;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 40px;
  cursor: pointer;
  padding: 10px;
  width: 50%;
  border-radius: 5px;

  &:hover {
    transition: all 0.2s;
    background-color: #4dabf7;
  }
`;

const MemberResource = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-content: center;
`;

export default MemberList;
