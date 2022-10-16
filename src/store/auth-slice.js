import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  expirationTime: "",
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.expirationTime = action.payload.expirationTime;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = "";
      state.expirationTime = "";

      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
    },
  },
});

export const authSliceActions = authSlice.actions;

export default authSlice.reducer;
