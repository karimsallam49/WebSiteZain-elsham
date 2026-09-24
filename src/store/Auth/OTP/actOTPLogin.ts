import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { TotpPhone } from "../../../DTO/AuthDTO";
import { OTPPhoneUrl } from "../../../EndPoints/EndPoints";
import type { RootState } from "../../store";

export const actOTPLogin = createAsyncThunk<TotpPhone, string, { state: RootState }>(
  "auth/otp-login",
  async (phoneNumber, { rejectWithValue, getState }) => {
    try {
      const { restaurantSettingsSlice } = getState();

      const res = await axios.post<TotpPhone>(
        `${OTPPhoneUrl}?phone=${phoneNumber}`,
        {}, 
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Branch-id": restaurantSettingsSlice.selectedBranch,
          },
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
