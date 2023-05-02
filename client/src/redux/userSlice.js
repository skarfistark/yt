import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    subscription: (state, action) => {
      if (state.currentUser.otherDetails.subscribedUsers.includes(action.payload)) {
        state.currentUser.otherDetails.subscribedUsers.splice(
          state.currentUser.otherDetails.subscribedUsers.findIndex(
            (channelId) => channelId === action.payload
          ),
          1
        );
      }
      else{
        state.currentUser.otherDetails.subscribedUsers.push(action.payload);
      }
    },
  },
});

export const { loginFailure, loginStart, loginSuccess, logout , subscription } =
userSlice.actions;

export default userSlice.reducer;
