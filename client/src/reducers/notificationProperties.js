export default function (state=null, action) {
  switch (action.type) {
    case 'SET_NOTIFICATION_PROPERTIES_SELECTOR':
      return action.payload;
      break;
  }
  return state;
}