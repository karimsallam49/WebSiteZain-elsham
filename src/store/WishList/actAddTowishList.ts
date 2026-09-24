import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { addWishListUri } from "../../EndPoints/EndPoints";
import axios from "axios";

export const actAddTowishList = createAsyncThunk<
  any, 
  { product_id: string | number }, 
  { state: RootState }
>(
  "wishlist/add",
  async (body, { getState, rejectWithValue }) => {
    const { LanguageSlice, OTPauthconfigration,restaurantSettingsSlice } = getState() as RootState;
    const currentLanguage = LanguageSlice.currentLanguage;
    const accessToken = OTPauthconfigration.OTPToken;

    if (!accessToken) return rejectWithValue("Token not found");

    try {
      const res = await axios.post(addWishListUri, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Branch-id": restaurantSettingsSlice.selectedBranch,

          "x-localization": currentLanguage || "en",
        },
      });

      return res.data;
    } catch (error: any) {
      console.error("❌ API Error:", error);
      return rejectWithValue(
        error?.response?.data || "حدث خطأ أثناء تحميل البيانات"
      );
    }
  }
);
