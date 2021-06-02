import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  singleDiary: false,
  singleDiaryDeleted: false,
  singleDiaryEdited: false,
  diaryYear: false,
  diaryYearDeleted: false,
  userName: '',
  show: false,
  selectedImage:0,
  images: [],
};

const changeSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    singleDiaryChanged(state) {
      state.singleDiary = !state.singleDiary;
    },
    singleDiaryDeleted(state) {
      state.singleDiaryDeleted = !state.singleDiaryDeleted;
    },
    singleDiaryEditedChanged(state) {
      state.singleDiaryEdited = !state.singleDiaryEdited;
    },
    diaryYearChanged(state) {
      state.diaryYear = !state.diaryYear;
    },
    diaryYearDeleted(state) {
      state.diaryYearDeleted = !state.diaryYearDeleted;
    },
    updateUserName(state, action) {
      state.userName = action.payload;
    },
    showGallery(state, action) {
      state.show = !state.show;
      state.selectedImage = action.payload;
    },
    updateGalleryImages(state, action) {
      state.images = action.payload;
    },
  },
});
export const changedDatabaseAction = changeSlice.actions;
export default changeSlice.reducer;
