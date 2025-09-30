import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface LoginState {
  email: string;
  password: string;
}

const initialState: LoginState = {
  email: "nto@dn.com",
  password: "123456",
};



const loginSlice = createSlice({
name: "login",
initialState,
reducers: {
    
},
});
export default loginSlice.reducer;