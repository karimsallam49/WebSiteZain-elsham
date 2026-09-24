import { createSlice } from "@reduxjs/toolkit";
import type { OrderDetailsIntial } from "../../DTO/OrderDTO";
import { actOrderDetails } from "./aCtGetOrderDetails";






const initialState:OrderDetailsIntial={
  OrderDetailsData:null,
  loading:false,
  error:null
}
const OrderdetailsSlice=createSlice({

    name:"OrderdetailsSlice",
    initialState,
    reducers:{

        
    },
    extraReducers:(builder)=>{

        builder.addCase(actOrderDetails.pending,(state)=>{

            state.loading=true;
            state.error=null
         })
        builder.addCase(actOrderDetails.fulfilled,(state,action)=>{

            state.loading=false
            state.OrderDetailsData=action.payload.status;
        })
        builder.addCase(actOrderDetails.rejected,(state,action)=>{
            if(action.payload && typeof action.payload=="string"){

                state.error=action.payload;
            }
        })

     
    }
})

export default OrderdetailsSlice.reducer
