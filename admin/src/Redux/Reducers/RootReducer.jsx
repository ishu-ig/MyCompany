import { combineReducers } from "@reduxjs/toolkit";
import CertificateReducer from "./CertificateReducer";
import ContactUsReducer from "./ContactUsReducer";
import TestimonialReducer from "./TestimonialReducer";
import BlogReducer from "./BlogReducer";

export default combineReducers({
    CertificateStateData: CertificateReducer,
    ContactUsStateData: ContactUsReducer,
    TestimonialStateData: TestimonialReducer,
    BlogStateData: BlogReducer,
});