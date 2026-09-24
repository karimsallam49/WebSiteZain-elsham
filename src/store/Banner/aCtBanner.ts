import type { BannerDTO } from "../../DTO/BannerDTO";
import { BannnerUrl } from "../../EndPoints/EndPoints";
import { createAppAsyncThunk } from "../FetchData/FetchData";

export const actBanner = createAppAsyncThunk<BannerDTO[]>(
  "Banner's/fetch",
  BannnerUrl
);
