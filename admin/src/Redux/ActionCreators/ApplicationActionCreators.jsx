import { GET_APPLICATION, UPDATE_APPLICATION } from "../Constants";

export function getApplication() {
  return {
    type: GET_APPLICATION,
  };
}

export function updateApplication(data) {
  return {
    type: UPDATE_APPLICATION,
    payload: data,
  };
}
