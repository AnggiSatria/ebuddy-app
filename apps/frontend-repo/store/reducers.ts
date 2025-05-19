import { createSlice } from "@reduxjs/toolkit";
import { getUserData, updateUser } from "./actions";
import type { User } from "@/packages/interface/user.interfaces";

export interface UserState {
  data: User | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: UserState = {
  data: null,
  loading: true,
  error: null,
  success: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetStatus(state) {
      state.data = null;
      state.loading = true;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.success = "User data fetched successfully";
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.success = "User data updated successfully";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetStatus } = userSlice.actions;
export default userSlice.reducer;
