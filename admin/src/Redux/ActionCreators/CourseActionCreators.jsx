import { CREATE_COURSE, DELETE_COURSE, GET_COURSE, UPDATE_COURSE } from "../Constants";

export function createCourse(data) {
  return {
    type: CREATE_COURSE,
    payload: data,
  };
}

export function getCourse() {
  return {
    type: GET_COURSE,
  };
}

export function updateCourse(data) {
  return {
    type: UPDATE_COURSE,
    payload: data,
  };
}

export function deleteCourse(data) {
  return {
    type: DELETE_COURSE,
    payload: data,
  };
}
