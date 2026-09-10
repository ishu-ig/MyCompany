import {
  CREATE_TESTIMONIAL_RED,
  DELETE_TESTIMONIAL_RED,
  GET_TESTIMONIAL_RED,
  UPDATE_TESTIMONIAL_RED,
} from "../Constants";

export default function TestimonialReducer(state = [], action) {
  switch (action.type) {
    case CREATE_TESTIMONIAL_RED:
      return action.payload ? [action.payload, ...(Array.isArray(state) ? state : [])] : state;

    case GET_TESTIMONIAL_RED:
      return Array.isArray(action.payload) ? action.payload : [];

    case UPDATE_TESTIMONIAL_RED:
      return Array.isArray(state)
        ? state.map((x) =>
            x._id === action.payload?._id ? { ...x, ...action.payload } : x
          )
        : [];

    case DELETE_TESTIMONIAL_RED:
      const delId = action.payload?._id || action.payload?.id || action.payload;
      return Array.isArray(state) ? state.filter((x) => x._id !== delId) : [];

    default:
      return state;
  }
}
