import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { OrderResponse, PlaceOrderDTO } from "../../DTO/CheckouDTO";
import { PlaceOrderUrl } from "../../EndPoints/EndPoints";
import type { RootState } from "../store";

export const actPlaceOrder = createAsyncThunk<
  OrderResponse,
  PlaceOrderDTO,
  { state: RootState }
>(
  "placeorder/post",
  async (PlaceOrderBody, { getState, rejectWithValue }) => {
    try {
      const { OTPauthconfigration,restaurantSettingsSlice } = getState();
      const accessToken = OTPauthconfigration.OTPToken;

      const res = await axios.post(PlaceOrderUrl, PlaceOrderBody, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        "Branch-id": restaurantSettingsSlice.selectedBranch,

        },
      });

      return res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "فشل تسجيل الطلب"
        );
      }
      return rejectWithValue("حدث خطأ غير متوقع أثناء تنفيذ الطلب");
    }
  }
);
