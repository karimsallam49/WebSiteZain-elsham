import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";

export const createAppAsyncThunk = <Returned>(
  typePrefix: string,
  apiUrl: string
) => {
  return createAsyncThunk<Returned, void, { state: RootState }>(
    typePrefix,
    async (_, { getState, rejectWithValue }) => {
      const {LanguageSlice,OTPauthconfigration,restaurantSettingsSlice}=getState() as RootState;
      const currentLanguage = LanguageSlice.currentLanguage;
      const accessToken = OTPauthconfigration.OTPToken;
      // const Temporarytoken=`eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiOWRhZTFlNjExNGNkYzgzM2U5N2FlYWViYzRlMmIzMDVmOTUwNjlhNzc0YjQ4YWM1NGY4Y2JiMDgzNDM0NmNhN2M5NjFiMThkMzQxNDQzZjgiLCJpYXQiOjE3NjA2MDE5MDguNzIxMzM0OTM0MjM0NjE5MTQwNjI1LCJuYmYiOjE3NjA2MDE5MDguNzIxMzM1ODg3OTA4OTM1NTQ2ODc1LCJleHAiOjE3OTIxMzc5MDguNzE4MTIwMDk4MTE0MDEzNjcxODc1LCJzdWIiOiI1Iiwic2NvcGVzIjpbXX0.lGxResZtX4SMd7eyITzkm7p8-e33syirN3Po6-YKw_vcjgTYDVTJzcZW-vHqVYbvG8FotDLGpGiBVDfRGFOpmpfUgev0I-p5jK7LZbEPkSBcleF6FAXUSsLlia1TXbYj_cPbe4r_hyDC86d7Qm-rgPkM_JCxeJ_YNBnbS3VOtGaTfnIuC1ki5QgCgz_Hn4-NbPFnQlKQXJqBncDy5HDS97K4gDKAeKrzD8fmJrksxkvhy9Y3ENwDEXzk_t-EHksyaBjuRxv4-zYQEsZo22B05Mm153i8RwHvN0a6OtwV7Ld1b73g1jQVPFBPORH1PGU5r6Hx2soguZAHrOsW2eXpG5-xonTf7oIMsfRFiXaekYLpsiuDmx8CvRhB3Nn_ViHXx4y_nDcqJTJKM1340xJeNpYRRPUwHJwLUAsMXIpCNKr4_xJZfrWn1dOJjrZhZin9UI3k9BgRYfnw2U1KTy6CPTENr1UmW_0i_0g76FFRsgdgwbkVVUVPcCZeaAFKVetH1kU-wOjvwLAyAIo8caGAvuIZ-WWIO8SXII_WWD355kYSeNxpwesope59SqHBkNG6PLF-eQNAHX8jMg0bdgWl0DnAzjgeEXxHtpWlVeByzgdCkegmUp0tOi7CjAeK9SXwkvDVWaTbd8MIJxooe_sOAPhksWZvNSz7-wu28kvFrRs`
      try {
        const res = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Branch-id": `${restaurantSettingsSlice.selectedBranch}`,
            "x-localization": currentLanguage || "en",
          },
        });

        return res.data as Returned;
      } catch (error: any) {
        console.error("❌ API Error:", error);
        return rejectWithValue(
          error?.response?.data || "حدث خطأ أثناء تحميل البيانات"
        );
      }
    }
  );
};
