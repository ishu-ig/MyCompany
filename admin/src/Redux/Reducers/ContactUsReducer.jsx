import {
  CREATE_CONTACT_US_RED,
  DELETE_CONTACT_US_RED,
  GET_CONTACT_US_RED,
  UPDATE_CONTACT_US_RED,
} from "../Constants";

export default function ContactUsReducer(state = [], action) {
  switch (action.type) {
    case CREATE_CONTACT_US_RED:
      return action.payload ? [action.payload, ...(Array.isArray(state) ? state : [])] : state;

    case GET_CONTACT_US_RED:
      return Array.isArray(action.payload) ? action.payload : [];

    case UPDATE_CONTACT_US_RED:
      return Array.isArray(state)
        ? state.map((x) =>
            x._id === action.payload?._id ? { ...x, ...action.payload } : x
          )
        : [];

    case DELETE_CONTACT_US_RED:
      const delId = action.payload?._id || action.payload?.id || action.payload;
      return Array.isArray(state) ? state.filter((x) => x._id !== delId) : [];

    default:
      return state;
  }
}
