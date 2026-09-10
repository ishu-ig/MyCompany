import { put, takeEvery } from "redux-saga/effects";
import {
  GET_APPLICATION,
  GET_APPLICATION_RED,
  UPDATE_APPLICATION,
  UPDATE_APPLICATION_RED,
} from "../Constants";
import {
  getRecord,
  updateRecord,
} from "./Service/ApiCallingService";

function* getSaga() {
  let response = yield getRecord("applications");
  if (response.success && response.data) {
    yield put({ type: GET_APPLICATION_RED, payload: response.data });
  }
}

function* updateSaga(action) {
  let response = yield updateRecord("applications", action.payload);
  if (response.success && response.data) {
    yield put({ type: UPDATE_APPLICATION_RED, payload: response.data });
  }
}

export default function* applicationSagas() {
  yield takeEvery(GET_APPLICATION, getSaga);
  yield takeEvery(UPDATE_APPLICATION, updateSaga);
}
