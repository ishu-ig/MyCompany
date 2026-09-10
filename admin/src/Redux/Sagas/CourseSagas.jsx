import { put, takeEvery } from "redux-saga/effects";
import {
  CREATE_COURSE,
  CREATE_COURSE_RED,
  DELETE_COURSE,
  DELETE_COURSE_RED,
  GET_COURSE,
  GET_COURSE_RED,
  UPDATE_COURSE,
  UPDATE_COURSE_RED,
} from "../Constants";
import {
  createRecord,
  deleteRecord,
  getRecord,
  updateRecord,
} from "./Service/ApiCallingService";

function* createSaga(action) {
  let response = yield createRecord("courses", action.payload);
  if (response.success && response.data) {
    yield put({ type: CREATE_COURSE_RED, payload: response.data });
  }
}

function* getSaga() {
  let response = yield getRecord("courses");
  if (response.success && response.data) {
    yield put({ type: GET_COURSE_RED, payload: response.data });
  }
}

function* updateSaga(action) {
  let response = yield updateRecord("courses", action.payload);
  if (response.success && response.data) {
    yield put({ type: UPDATE_COURSE_RED, payload: response.data });
  }
}

function* deleteSaga(action) {
  yield deleteRecord("courses", action.payload);
  yield put({ type: DELETE_COURSE_RED, payload: action.payload });
}

export default function* courseSagas() {
  yield takeEvery(CREATE_COURSE, createSaga);
  yield takeEvery(GET_COURSE, getSaga);
  yield takeEvery(UPDATE_COURSE, updateSaga);
  yield takeEvery(DELETE_COURSE, deleteSaga);
}
