import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { TotpPhone } from "../../../DTO/AuthDTO";
import { ForgetPassordUrl } from "../../../EndPoints/EndPoints";
import type { RootState } from "../../store";

export const actOTPForgetPassword = createAsyncThunk<TotpPhone, string, { state: RootState }>(
  "auth/otp-forget-password",
  async (phoneNumber, { rejectWithValue, getState }) => {
    try {
      const { restaurantSettingsSlice } = getState();

      const res = await axios.post<TotpPhone>(
        `${ForgetPassordUrl}`,
        {}, 
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Branch-id": restaurantSettingsSlice.selectedBranch,
          },
          params: {
            email_or_phone: phoneNumber,
            type: "phone"
          }
        }
      );

      return res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "فشل تسجيل الدخول");
      }
      return rejectWithValue("حدث خطأ غير متوقع أثناء تسجيل الدخول");
    }
  }
);
