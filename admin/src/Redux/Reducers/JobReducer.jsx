import {
  CREATE_JOB_RED,
  DELETE_JOB_RED,
  GET_JOB_RED,
  UPDATE_JOB_RED,
} from "../Constants";

export default function JobReducer(state = [], action) {
  switch (action.type) {
    case CREATE_JOB_RED:
      return action.payload ? [action.payload, ...(Array.isArray(state) ? state : [])] : state;

    case GET_JOB_RED:
      return Array.isArray(action.payload) ? action.payload : [];

    case UPDATE_JOB_RED:
      return Array.isArray(state)
        ? state.map((x) =>
            x._id === action.payload?._id ? { ...x, ...action.payload } : x
          )
        : [];

    case DELETE_JOB_RED:
      const delId = action.payload?._id || action.payload?.id || action.payload;
      return Array.isArray(state) ? state.filter((x) => x._id !== delId) : [];

    default:
      return state;
  }
}
