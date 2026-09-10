import { put, takeEvery } from "redux-saga/effects";
import {
  CREATE_CERTIFICATE,
  CREATE_CERTIFICATE_RED,
  DELETE_CERTIFICATE,
  DELETE_CERTIFICATE_RED,
  GET_CERTIFICATE,
  GET_CERTIFICATE_RED,
  UPDATE_CERTIFICATE,
  UPDATE_CERTIFICATE_RED,
} from "../Constants";
import {
  createRecord,
  deleteRecord,
  getRecord,
  updateRecord,
} from "./Service/ApiCallingService";

function* createSaga(action) {
  let response = yield createRecord("certificates", action.payload);
  if (response.success && response.data) {
    yield put({ type: CREATE_CERTIFICATE_RED, payload: response.data });
  }
}

function* getSaga() {
  let response = yield getRecord("certificates");
  if (response.success && response.data) {
    yield put({ type: GET_CERTIFICATE_RED, payload: response.data });
  }
}

function* updateSaga(action) {
  let response = yield updateRecord("certificates", action.payload);
  if (response.success && response.data) {
    yield put({ type: UPDATE_CERTIFICATE_RED, payload: response.data });
  }
}

function* deleteSaga(action) {
  yield deleteRecord("certificates", action.payload);
  yield put({ type: DELETE_CERTIFICATE_RED, payload: action.payload });
}

export default function* certificateSagas() {
  yield takeEvery(CREATE_CERTIFICATE, createSaga);
  yield takeEvery(GET_CERTIFICATE, getSaga);
  yield takeEvery(UPDATE_CERTIFICATE, updateSaga);
  yield takeEvery(DELETE_CERTIFICATE, deleteSaga);
}