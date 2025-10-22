import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "../api/api";
import * as bcrypt from "bcryptjs";

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  cell: string;
}

interface LoginState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginData {
  email: string;
  password: string;
}

const initialState: LoginState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  User,
  LoginData,
  { rejectValue: string }
>("login/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const res = await api.get(`/users?email=${credentials.email}`);
    const user = res.data[0];
    if (!user) return rejectWithValue("User not found");

    const isMatch = bcrypt.compareSync(credentials.password, user.password);
    if (!isMatch) return rejectWithValue("Incorrect password");

    return user;
  } catch (err) {
    return rejectWithValue("Login failed. Try again.");
  }
});

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearLoginError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout, clearLoginError, updateUser } = loginSlice.actions;
export default loginSlice.reducer;
