export default function (state=null, action) {
  switch (action.type) {
    case 'SET_PROPERTY_DATA':
      return action.payload;
      break;
  }
  return state;
}