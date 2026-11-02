// src/store/languageSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
  currentLanguage: "ar" | "en";
}

const savedLang = localStorage.getItem("i18nextLng");

const initialState: LanguageState = {
  currentLanguage: savedLang === "en" ? "en" : "ar",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<"ar" | "en">) => {
      state.currentLanguage = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
