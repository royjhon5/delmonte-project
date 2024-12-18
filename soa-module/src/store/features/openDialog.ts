import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
    value: boolean;
}

const initialState: CounterState = {
    value: false,
}

const openDialog = createSlice({
    name: 'openDialog',
    initialState,
    reducers: {
      openThisDialog: (state) => {
        state.value = true;
      },
      closeThisDialog: (state) => {
        state.value = false;
      },
    },  
});

export const { openThisDialog, closeThisDialog } = openDialog.actions;
export default openDialog.reducer;

