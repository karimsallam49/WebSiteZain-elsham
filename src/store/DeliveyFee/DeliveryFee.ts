import type { BranchDeliveryChargeResponse } from "../../DTO/DeliveryFeeDTO";
import { DeliveriinfoUrl } from "../../EndPoints/EndPoints";
import { createAppAsyncThunk } from "../FetchData/FetchData";

export const actDeliveryFee = createAppAsyncThunk<BranchDeliveryChargeResponse>(
  "DeliveryFee/fetch",
  DeliveriinfoUrl
);
