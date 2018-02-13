export default function (state=false, action) {
  switch (action.type) {
    case 'SET_SECRET_ERROR_STATE_SELECTOR':
      return action.payload;
      break;
  }
  return state;
}