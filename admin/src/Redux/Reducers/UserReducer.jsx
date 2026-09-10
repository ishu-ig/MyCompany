import {
  GET_USER_RED,
  UPDATE_USER_RED,
  DELETE_USER_RED,
} from "../Constants";

export default function UserReducer(state = [], action) {
  switch (action.type) {
    case GET_USER_RED:
      return Array.isArray(action.payload) ? action.payload : [];

    case UPDATE_USER_RED:
      return Array.isArray(state)
        ? state.map((x) =>
            x._id === action.payload?._id ? { ...x, ...action.payload } : x
          )
        : [];

    case DELETE_USER_RED:
      const delId = action.payload?._id || action.payload?.id || action.payload;
      return Array.isArray(state) ? state.filter((x) => x._id !== delId) : [];

    default:
      return state;
  }
}
