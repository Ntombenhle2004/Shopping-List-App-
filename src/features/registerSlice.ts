// src/features/registerSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "../api/api";
import * as bcrypt from "bcryptjs";

interface RegisterState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
  cell: string;
}

const initialState: RegisterState = {
  loading: false,
  error: null,
  success: null,
};

// ✅ Fix: type the rejectWithValue as string
export const registerUser = createAsyncThunk<
  void,
  RegisterData,
  { rejectValue: string }
>("register/registerUser", async (userData, { rejectWithValue }) => {
  try {
    // GET users with email filter
    const res = await api.get<RegisterData[]>(`/users?email=${userData.email}`);

    if (res.data.length > 0) {
      return rejectWithValue("User already registered");
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(userData.password, 10);

    // POST new user
    await api.post("/users", { ...userData, password: hashedPassword });

    return;
  } catch (err) {
    return rejectWithValue(
      "Registration failed. Check your server connection."
    );
  }
});

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.error = null;
      state.success = null;
    },





    
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = "Registration successful! Please login.";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { clearMessage } = registerSlice.actions;
export default registerSlice.reducer;
