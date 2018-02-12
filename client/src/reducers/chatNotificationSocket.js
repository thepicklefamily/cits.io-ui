export default function (state=null, action) {
  switch (action.type) {
    case 'SET_CHAT_NOTIFICATION_SOCKET_SELECTOR':
      return action.payload;
      break;
  }
  return state;
}