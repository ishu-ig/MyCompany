import { put, takeEvery } from "redux-saga/effects";
import {
  DELETE_USER,
  DELETE_USER_RED,
  GET_USER,
  GET_USER_RED,
  UPDATE_USER,
  UPDATE_USER_RED,
} from "../Constants";
import {
  deleteRecord,
  getRecord,
  updateRecord,
} from "./Service/ApiCallingService";

function* getSaga(action) {
  const query = action.payload ? `?${new URLSearchParams(action.payload).toString()}` : "";
  let response = yield getRecord(`admin/users${query}`);
  if (response.success && response.data) {
    yield put({ type: GET_USER_RED, payload: response.data });
  }
}

function* updateSaga(action) {
  let response = yield updateRecord("admin/users", action.payload);
  if (response.success && response.data) {
    yield put({ type: UPDATE_USER_RED, payload: response.data });
  }
}

function* deleteSaga(action) {
  yield deleteRecord("admin/users", action.payload);
  yield put({ type: DELETE_USER_RED, payload: action.payload });
}

export default function* userSagas() {
  yield takeEvery(GET_USER, getSaga);
  yield takeEvery(UPDATE_USER, updateSaga);
  yield takeEvery(DELETE_USER, deleteSaga);
}
