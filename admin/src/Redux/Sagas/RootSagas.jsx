import { all } from "redux-saga/effects";
import certificateSagas from "./CertificateSagas";
import contactUsSagas from "./ContactUsSagas";
import testimonialSagas from "./TestimonialSagas";
import blogSagas from "./BlogSagas";

export default function* RootSaga() {
    yield all([
        certificateSagas(),
        contactUsSagas(),
        testimonialSagas(),
        blogSagas(),
    ]);
}