export const createRoom = async ({ fetchApiPrivate, roomData }) => {
  const response = await fetchApiPrivate.post(`api/chats/rooms/new`, roomData);

  return response;
};

export const getRoom = async (fetchApiPrivate, room_id) => {
  const response = await fetchApiPrivate.get(`api/chats/rooms/${room_id}`);

  return response;
};

export const getRoomsByUsers = async ({
  fetchApiPrivate,
  rooms,
  user_id,
  members,
}) => {
  const response = await fetchApiPrivate.get("api/chats/rooms", {
    params: { rooms, user_id, members },
  });

  return response;
};

export const translateMessage = async (fetchApiPrivate, message_id) => {
  const response = await fetchApiPrivate.get(
    `api/chats/messages/${message_id}`
  );

  return response;
};
