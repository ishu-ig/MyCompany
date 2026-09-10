import { put, takeEvery } from "redux-saga/effects";
import {
  CREATE_BLOG,
  CREATE_BLOG_RED,
  DELETE_BLOG,
  DELETE_BLOG_RED,
  GET_BLOG,
  GET_BLOG_RED,
  UPDATE_BLOG,
  UPDATE_BLOG_RED,
} from "../Constants";
import {
  createRecord,
  deleteRecord,
  getRecord,
  updateRecord,
} from "./Service/ApiCallingService";

function* createSaga(action) {
  let response = yield createRecord("blogs", action.payload);
  if (response.success && response.data) {
    yield put({ type: CREATE_BLOG_RED, payload: response.data });
  }
}

function* getSaga() {
  let response = yield getRecord("blogs");
  if (response.success && response.data) {
    yield put({ type: GET_BLOG_RED, payload: response.data });
  }
}

function* updateSaga(action) {
  let response = yield updateRecord("blogs", action.payload);
  if (response.success && response.data) {
    yield put({ type: UPDATE_BLOG_RED, payload: response.data });
  }
}

function* deleteSaga(action) {
  yield deleteRecord("blogs", action.payload);
  yield put({ type: DELETE_BLOG_RED, payload: action.payload });
}

export default function* blogSagas() {
  yield takeEvery(CREATE_BLOG, createSaga);
  yield takeEvery(GET_BLOG, getSaga);
  yield takeEvery(UPDATE_BLOG, updateSaga);
  yield takeEvery(DELETE_BLOG, deleteSaga);
}