export default function (state=[], action) {
  switch (action.type) {
    case 'SET_NOTIFICATION_PROPERTIES_SELECTOR':
      return action.payload;
      break;
  }
  return state;
}