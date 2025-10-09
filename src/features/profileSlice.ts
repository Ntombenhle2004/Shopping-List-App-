import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "../api/api";

interface Profile {
  id: number;
  name: string;
  surname: string;
  email: string;
  cell: string;
  password: string;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  success: null,
};

export const updateProfile = createAsyncThunk<
  Profile,
  Profile,
  { rejectValue: string }
>("profile/updateProfile", async (data, { rejectWithValue }) => {
  try {
    const { data: updated } = await api.put(`/users/${data.id}`, data);
    return updated;
  } catch {
    return rejectWithValue("Update failed");
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.loading = false;
          state.profile = action.payload;
          state.success = "Profile updated successfully!";
        }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfileMessages } = profileSlice.actions;
export default profileSlice.reducer;
