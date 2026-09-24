// src/store/Promo/actValidateCoupon.ts

import type { AddressDTO } from "../../DTO/AdressDTO";
import { GetAdressURL } from "../../EndPoints/EndPoints";
import { createAppAsyncThunk } from "../FetchData/FetchData";


export const actGetadress = createAppAsyncThunk<AddressDTO[]>(
  "GetAdress/fetch",
  GetAdressURL
);
