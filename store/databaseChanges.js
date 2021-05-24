import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  singleDiary: false,
  singleDiaryDeleted: false,
  singleDiaryEdited: false,
  diaryYear: false,
  diaryYearDeleted: false,
  userName: 'Guest',
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
    updateUserName(state,action) {
      state.userName =action.payload;
    },
  },
});
export const changedDatabaseAction = changeSlice.actions;
export default changeSlice.reducer;
