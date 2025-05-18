import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserData, updateUserData } from "../apis/userApis";
import type { User } from "@/packages/interface/user.interfaces";

export const getUserData = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("user/fetchUserData", async (_, thunkAPI) => {
  try {
    const data = await fetchUserData();
    return data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateUser = createAsyncThunk<
  User, // return type
  { id: string; data: Partial<User> } // argument type
>("user/updateUserData", async ({ id, data }, thunkAPI) => {
  try {
    const updated = await updateUserData(id, data);
    return updated;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
