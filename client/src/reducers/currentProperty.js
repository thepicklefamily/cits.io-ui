export default function (state=null, action) {
  switch (action.type) {
    case 'SET_CURRENT_PROPERTY':
      return action.payload;
      break;
  }
  return state;
}