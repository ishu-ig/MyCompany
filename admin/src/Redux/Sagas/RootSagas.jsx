import { all } from "redux-saga/effects";
import certificateSagas from "./CertificateSagas";
import contactUsSagas from "./ContactUsSagas";
import testimonialSagas from "./TestimonialSagas";
import blogSagas from "./BlogSagas";
import courseSagas from "./CourseSagas";
import jobSagas from "./JobSagas";
import userSagas from "./UserSagas";
import applicationSagas from "./ApplicationSagas";

export default function* RootSaga() {
  yield all([
    certificateSagas(),
    contactUsSagas(),
    testimonialSagas(),
    blogSagas(),
    courseSagas(),
    jobSagas(),
    userSagas(),
    applicationSagas(),
  ]);
}