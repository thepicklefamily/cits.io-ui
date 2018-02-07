export default function (state=null, action) {
  switch (action.type) {
    case 'SET_TICKETS_DATA_SELECTOR':
      return action.payload;
      break;
  }
  return state;
}