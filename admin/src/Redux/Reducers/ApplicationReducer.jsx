import {
  GET_APPLICATION_RED,
  UPDATE_APPLICATION_RED,
} from "../Constants";

export default function ApplicationReducer(state = [], action) {
  switch (action.type) {
    case GET_APPLICATION_RED:
      return Array.isArray(action.payload) ? action.payload : [];

    case UPDATE_APPLICATION_RED:
      return Array.isArray(state)
        ? state.map((x) =>
            x._id === action.payload?._id ? { ...x, ...action.payload } : x
          )
        : [];

    default:
      return state;
  }
}
