import { createSlice } from "@reduxjs/toolkit";
import type { UserDTO } from "../../DTO/UserDTO";
import { actGetUser } from "./actGetUser";

interface Userinfoinitial {
  UserData: UserDTO | null;
  userLocation:string| null;
  loading: boolean;
  error: string | null;
}

const initialState: Userinfoinitial = {
  UserData: null,
  userLocation:null,
  loading: false,
  error: null,
};

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    clearuserinfo: (state) => {
      state.UserData = null;
      state.error = null;
      state.loading = false;
    },

    setLocation:(state,action)=>{
      state.userLocation=action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetUser.fulfilled, (state, action) => {
        state.loading = false;
        state.UserData = action.payload;
      })
      .addCase(actGetUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "حدث خطأ أثناء تحميل الإشعارات";
      });
  },
});

export const { clearuserinfo,setLocation } = UserSlice.actions;
export default UserSlice.reducer;
