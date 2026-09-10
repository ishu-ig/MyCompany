import { put, takeEvery } from "redux-saga/effects";
import {
  CREATE_JOB,
  CREATE_JOB_RED,
  DELETE_JOB,
  DELETE_JOB_RED,
  GET_JOB,
  GET_JOB_RED,
  UPDATE_JOB,
  UPDATE_JOB_RED,
} from "../Constants";
import {
  createRecord,
  deleteRecord,
  getRecord,
  updateRecord,
} from "./Service/ApiCallingService";

function* createSaga(action) {
  let response = yield createRecord("jobs", action.payload);
  if (response.success && response.data) {
    yield put({ type: CREATE_JOB_RED, payload: response.data });
  }
}

function* getSaga() {
  let response = yield getRecord("jobs");
  if (response.success && response.data) {
    yield put({ type: GET_JOB_RED, payload: response.data });
  }
}

function* updateSaga(action) {
  let response = yield updateRecord("jobs", action.payload);
  if (response.success && response.data) {
    yield put({ type: UPDATE_JOB_RED, payload: response.data });
  }
}

function* deleteSaga(action) {
  yield deleteRecord("jobs", action.payload);
  yield put({ type: DELETE_JOB_RED, payload: action.payload });
}

export default function* jobSagas() {
  yield takeEvery(CREATE_JOB, createSaga);
  yield takeEvery(GET_JOB, getSaga);
  yield takeEvery(UPDATE_JOB, updateSaga);
  yield takeEvery(DELETE_JOB, deleteSaga);
}
