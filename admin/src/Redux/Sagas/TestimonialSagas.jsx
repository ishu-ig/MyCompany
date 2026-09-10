import { put, takeEvery } from "redux-saga/effects";
import {
  CREATE_TESTIMONIAL,
  CREATE_TESTIMONIAL_RED,
  DELETE_TESTIMONIAL,
  DELETE_TESTIMONIAL_RED,
  GET_TESTIMONIAL,
  GET_TESTIMONIAL_RED,
  UPDATE_TESTIMONIAL,
  UPDATE_TESTIMONIAL_RED,
} from "../Constants";
import {
  createRecord,
  deleteRecord,
  getRecord,
  updateRecord,
} from "./Service/ApiCallingService";

function* createSaga(action) {
  let response = yield createRecord("testimonials", action.payload);
  if (response.success && response.data) {
    yield put({ type: CREATE_TESTIMONIAL_RED, payload: response.data });
  }
}

function* getSaga() {
  let response = yield getRecord("testimonials");
  if (response.success && response.data) {
    yield put({ type: GET_TESTIMONIAL_RED, payload: response.data });
  }
}

function* updateSaga(action) {
  let response = yield updateRecord("testimonials", action.payload);
  if (response.success && response.data) {
    yield put({ type: UPDATE_TESTIMONIAL_RED, payload: response.data });
  }
}

function* deleteSaga(action) {
  yield deleteRecord("testimonials", action.payload);
  yield put({ type: DELETE_TESTIMONIAL_RED, payload: action.payload });
}

export default function* testimonialSagas() {
  yield takeEvery(CREATE_TESTIMONIAL, createSaga);
  yield takeEvery(GET_TESTIMONIAL, getSaga);
  yield takeEvery(UPDATE_TESTIMONIAL, updateSaga);
  yield takeEvery(DELETE_TESTIMONIAL, deleteSaga);
}