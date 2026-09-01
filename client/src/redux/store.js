import { configureStore } from '@reduxjs/toolkit';
import certificateReducer from './slices/certificateSlice';
import applicationReducer from './slices/applicationSlice';
import contactReducer from './slices/contactSlice';
import courseReducer from './slices/courseSlice';
import testimonialReducer from './slices/testimonialSlice';
import serviceReducer from './slices/serviceSlice';
import aboutReducer from './slices/aboutSlice';

export const store = configureStore({
  reducer: {
    certificate: certificateReducer,
    application: applicationReducer,
    contact: contactReducer,
    courses: courseReducer,
    testimonials: testimonialReducer,
    services: serviceReducer,
    about: aboutReducer,
  },
});

export default store;
