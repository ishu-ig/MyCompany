import {
  CREATE_COURSE_RED,
  DELETE_COURSE_RED,
  GET_COURSE_RED,
  UPDATE_COURSE_RED,
} from "../Constants";

export default function CourseReducer(state = [], action) {
  switch (action.type) {
    case CREATE_COURSE_RED:
      return action.payload ? [action.payload, ...(Array.isArray(state) ? state : [])] : state;

    case GET_COURSE_RED:
      return Array.isArray(action.payload) ? action.payload : [];

    case UPDATE_COURSE_RED:
      return Array.isArray(state)
        ? state.map((x) =>
            x._id === action.payload?._id ? { ...x, ...action.payload } : x
          )
        : [];

    case DELETE_COURSE_RED:
      const delId = action.payload?._id || action.payload?.id || action.payload;
      return Array.isArray(state) ? state.filter((x) => x._id !== delId) : [];

    default:
      return state;
  }
}
