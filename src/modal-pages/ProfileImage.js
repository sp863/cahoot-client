import useRefreshToken from "../hooks/refreshToken-hook";

const ProfileImage = () => {
  const refresh = useRefreshToken();

  return (
    <div>
      Profile Image
      <button onClick={() => refresh()}>Refresh</button>;
    </div>
  );
};

export default ProfileImage;
