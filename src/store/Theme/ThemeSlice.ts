import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type DesignVersion = "v1" | "v2";

interface ThemeState {
  designVersion: DesignVersion;
  hasChosenDesign: boolean;
}

const initialState: ThemeState = {
  designVersion: "v1",
  hasChosenDesign: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setDesignVersion: (state, action: PayloadAction<DesignVersion>) => {
      state.designVersion = action.payload;
      state.hasChosenDesign = true;
    },
  },
});

export const { setDesignVersion } = themeSlice.actions;
export default themeSlice.reducer;
