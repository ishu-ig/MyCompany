import { combineReducers } from "@reduxjs/toolkit";
import CertificateReducer from "./CertificateReducer";
import ContactUsReducer from "./ContactUsReducer";
import TestimonialReducer from "./TestimonialReducer";
import BlogReducer from "./BlogReducer";
import CourseReducer from "./CourseReducer";
import JobReducer from "./JobReducer";
import UserReducer from "./UserReducer";
import ApplicationReducer from "./ApplicationReducer";

export default combineReducers({
  CertificateStateData: CertificateReducer,
  ContactUsStateData: ContactUsReducer,
  TestimonialStateData: TestimonialReducer,
  BlogStateData: BlogReducer,
  CourseStateData: CourseReducer,
  JobStateData: JobReducer,
  UserStateData: UserReducer,
  ApplicationStateData: ApplicationReducer,
});