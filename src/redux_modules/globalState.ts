import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 'initialValue',
};

const globalState = createSlice({
  name: 'globalState',
  initialState,
  reducers: {
    change(state: { value: string }, action: { payload: string }) {
      state.value = action.payload;
    },
  },
});

export const globalStateActions = globalState.actions;
export default globalState.reducer;
