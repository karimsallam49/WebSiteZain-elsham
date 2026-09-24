import { createSlice } from "@reduxjs/toolkit";
import { actVerifyPhone } from "./actVerifiyPhone";
import type { TOtpState } from "../../../DTO/AuthDTO";
import { actLoginByPhone } from "./actLoginByPhone";
import { actRegisterByPhone } from "./actRegisterByPhone";





const initialState:TOtpState={
  OTPToken:null,
    statue:false,
  PhoneVerified:false,

  loading:"idle",
  error:null
}
const OTPLoginSlice=createSlice({

    name:"OTPLoginSlice",
    initialState,
    reducers:{

        resete:(state)=>{

            state.error=null;
            state.loading="idle";


        },
        logout:(state)=>{

            state.OTPToken=null;
            
        }
    },
    extraReducers:(builder)=>{

        builder.addCase(actVerifyPhone.pending,(state)=>{

            state.loading="pending";
            state.error=null
         })
        builder.addCase(actVerifyPhone.fulfilled,(state,action)=>{

            state.loading="succeeded"
            state.statue=action.payload.status;
            state.OTPToken=action.payload.token;
        })
        builder.addCase(actVerifyPhone.rejected,(state,action)=>{
            if(action.payload && typeof action.payload=="string"){

                state.error=action.payload;
            }
        })
        builder.addCase(actLoginByPhone.pending,(state)=>{

            state.loading="pending";
            state.error=null
         })
        builder.addCase(actLoginByPhone.fulfilled,(state,action)=>{

            state.loading="succeeded"
            state.statue=action.payload.status;
            state.OTPToken=action.payload.token;
        })
        builder.addCase(actLoginByPhone.rejected,(state,action)=>{
            if(action.payload && typeof action.payload=="string"){

                state.error=action.payload;
            }
        })
        builder.addCase(actRegisterByPhone.pending,(state)=>{

            state.loading="pending";
            state.error=null
         })
        builder.addCase(actRegisterByPhone.fulfilled,(state,action)=>{

            state.loading="succeeded"
            state.statue=action.payload.status??true;
            state.OTPToken=action.payload.token;
        })
        builder.addCase(actRegisterByPhone.rejected,(state,action)=>{
            if(action.payload && typeof action.payload=="string"){

                state.error=action.payload;
            }
        })

     
    }
})

export default OTPLoginSlice.reducer
export const{resete,logout}=OTPLoginSlice.actions
