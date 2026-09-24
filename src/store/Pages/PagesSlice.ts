import { createSlice } from "@reduxjs/toolkit";
import {  PagesUrl } from "../../EndPoints/EndPoints";
import { createAppAsyncThunk } from "../FetchData/FetchData";
import type { StaticPagesResponse } from "../../DTO/PagesDTO";


export const FetchPages = createAppAsyncThunk<StaticPagesResponse>(
  "Pages/fetch",
  PagesUrl
);

interface PageInitail {
  PageData: StaticPagesResponse|null;
  loading: boolean;
  error: string | null;
}

const initialState: PageInitail = {
  PageData: null,
  loading: false,
  error: null,
};

const PagesSlice = createSlice({
  name: "PagesSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchPages.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchPages.fulfilled, (state, action) => {
        state.loading = false;
        state.PageData = action.payload;
      })
      .addCase(FetchPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default PagesSlice.reducer;
