import styled from "styled-components";
import useAuth from "../hooks/auth-hook";

const MemberList = ({ fetchApiPrivate, members, projectUrl }) => {
  const { auth } = useAuth();

  // console.log("auth", auth.user);
  // console.log("members", members);

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
          .map((member) => {
            return (
              <MemberCard>
                <Member>
                  <MemberImage src={member.imageUrl} alt={member.name} />
                  <div>{member.name}</div>
                </Member>
                <MemberResource>
                  <div>Chat Icon</div>
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

const MemberResource = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-content: center;
`;

export default MemberList;
