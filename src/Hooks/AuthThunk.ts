import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { ApiThunkParams } from "../DTO/AuthDTO";

export const createApiThunk = <TFormData = any, TResult = any>({
  name,
  url,
  method = "POST",
}: ApiThunkParams) => {
  return createAsyncThunk<TResult, TFormData>(
    name,
    async (formdata: TFormData, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await axios({
          method,
          url,
          data: formdata,
        });
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return rejectWithValue(error.response?.data?.message || error.message);
        } else {
          return rejectWithValue("Unexpected error");
        }
      }
    }
  );
};
