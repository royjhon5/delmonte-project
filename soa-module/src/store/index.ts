import { configureStore } from '@reduxjs/toolkit';
import openDialogReduce from './features/openDialog'

export const store = configureStore({
  reducer: {
    openDialog: openDialogReduce
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
