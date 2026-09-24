import { createSlice } from "@reduxjs/toolkit";
import { actNotifications } from "./actNotification";
import type { NoticicationsDTO } from "../../DTO/NoticicationsDTO";

interface NotificationsState {
  notificationsData: NoticicationsDTO[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notificationsData: null,
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notificationsData = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notificationsData = action.payload;
      })
      .addCase(actNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "حدث خطأ أثناء تحميل الإشعارات";
      });
  },
});

export const { clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
