import {configureStore} from '@reduxjs/toolkit';
import databaseChanges from './databaseChanges';

const store = configureStore({
  reducer: databaseChanges,
});

export default store;
