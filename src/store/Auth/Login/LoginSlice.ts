import { createSlice } from "@reduxjs/toolkit";
import { actregisture } from "../Registure/actRegisture";
import { actAuthLogin } from "./actLogin";
import type { Tauthstate } from "../../../DTO/AuthDTO";






const initialState:Tauthstate={
  accsessToken:null,
  users:null,
  loading:"idle",
  error:null
}
const LoginSlice=createSlice({

    name:"loginSlice",
    initialState,
    reducers:{

        resete:(state)=>{

            state.error=null;
            state.loading="idle";


        },
        logout:(state)=>{

            state.accsessToken=null;
            state.users=null;
            
        }
    },
    extraReducers:(builder)=>{

        builder.addCase(actregisture.pending,(state)=>{

            state.loading="pending";
            state.error=null
         })
        builder.addCase(actregisture.fulfilled,(state)=>{

            state.loading="succeeded"
        })
        builder.addCase(actregisture.rejected,(state,action)=>{
            if(action.payload && typeof action.payload=="string"){

                state.error=action.payload;
            }
        })

        // login
        builder.addCase(actAuthLogin.pending,(state)=>{

            state.loading="pending";
            state.error=null
         })
        builder.addCase(actAuthLogin.fulfilled,(state,action)=>{

            state.loading="succeeded"
            state.accsessToken=action.payload.accessToken
            state.users=action.payload.user
        })
        builder.addCase(actAuthLogin.rejected,(state,action)=>{
            if(action.payload && typeof action.payload=="string"){

                state.error=action.payload;
                state.loading="failed"
            }
        })
    
    }
})

export default LoginSlice.reducer
export const{resete,logout}=LoginSlice.actions
