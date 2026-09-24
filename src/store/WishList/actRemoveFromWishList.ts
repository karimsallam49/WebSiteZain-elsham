import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import axios from "axios";
import { removeWishListUri } from "../../EndPoints/EndPoints";



export const actRemoveFromWishList = createAsyncThunk<
any,
  any, 

  { state: RootState }
>("update/user", async (body, { getState, rejectWithValue }) => {
  const { LanguageSlice, OTPauthconfigration,restaurantSettingsSlice } = getState() as RootState;
  const currentLanguage = LanguageSlice.currentLanguage;
  const accessToken = OTPauthconfigration.OTPToken
  const FinalBody={
    ...body,
    type: "single"
  }
  try {
const res = await axios.delete(`${removeWishListUri}`, {
  data: FinalBody, // ✅ هنا بتحط الـ body جوه config
  headers: {
    Authorization: `Bearer ${accessToken}`,
          "Branch-id": restaurantSettingsSlice.selectedBranch,

    "Content-Type": "application/json",
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
});
