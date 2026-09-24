

import type { TLoginData, TResponse } from "../../../DTO/AuthDTO";
import { createApiThunk } from "../../../Hooks/AuthThunk";





export const actAuthLogin = createApiThunk<TLoginData, TResponse>({
  name: "auth/login",
  url: "http://localhost:3000/login",
});
