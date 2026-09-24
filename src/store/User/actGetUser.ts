import type { UserDTO } from "../../DTO/UserDTO";
import { UserInfoUrl } from "../../EndPoints/EndPoints";
import { createAppAsyncThunk } from "../FetchData/FetchData";


export const actGetUser = createAppAsyncThunk<UserDTO>(
  "actgetuser/fetch",
  UserInfoUrl
);
