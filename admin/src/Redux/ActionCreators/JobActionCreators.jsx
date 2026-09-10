import { CREATE_JOB, DELETE_JOB, GET_JOB, UPDATE_JOB } from "../Constants";

export function createJob(data) {
  return {
    type: CREATE_JOB,
    payload: data,
  };
}

export function getJob() {
  return {
    type: GET_JOB,
  };
}

export function updateJob(data) {
  return {
    type: UPDATE_JOB,
    payload: data,
  };
}

export function deleteJob(data) {
  return {
    type: DELETE_JOB,
    payload: data,
  };
}
