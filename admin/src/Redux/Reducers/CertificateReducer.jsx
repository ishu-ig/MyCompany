import {
  CREATE_CERTIFICATE_RED,
  DELETE_CERTIFICATE_RED,
  GET_CERTIFICATE_RED,
  UPDATE_CERTIFICATE_RED,
} from "../Constants";

export default function CertificateReducer(state = [], action) {
  switch (action.type) {
    case CREATE_CERTIFICATE_RED:
      return action.payload ? [action.payload, ...(Array.isArray(state) ? state : [])] : state;

    case GET_CERTIFICATE_RED:
      return Array.isArray(action.payload) ? action.payload : [];

    case UPDATE_CERTIFICATE_RED:
      return Array.isArray(state)
        ? state.map((x) =>
            x._id === action.payload?._id ? { ...x, ...action.payload } : x
          )
        : [];

    case DELETE_CERTIFICATE_RED:
      const delId = action.payload?._id || action.payload?.id || action.payload;
      return Array.isArray(state) ? state.filter((x) => x._id !== delId) : [];

    default:
      return state;
  }
}
