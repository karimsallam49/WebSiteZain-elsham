import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ResetPasswordUrl } from "../../../EndPoints/EndPoints";

interface ResetPasswordPayload {
  _method: string;
  reset_token: string;
  password: string;
  confirm_password: string;
  email_or_phone: string;
  type: string;
}

export const actResetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(ResetPasswordUrl, payload);
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);
