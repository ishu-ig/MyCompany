import { GET_USER, UPDATE_USER, DELETE_USER } from "../Constants";

export function getUser(query) {
  return {
    type: GET_USER,
    payload: query,
  };
}

export function updateUser(data) {
  return {
    type: UPDATE_USER,
    payload: data,
  };
}

export function deleteUser(data) {
  return {
    type: DELETE_USER,
    payload: data,
  };
}
