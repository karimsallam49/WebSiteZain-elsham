

import type { TloginWithPhoneData, TVerifyrespone } from "../../../DTO/AuthDTO";
import { LoginByPhoneUrl } from "../../../EndPoints/EndPoints";
import { createApiThunk } from "../../../Hooks/AuthThunk";





export const actLoginByPhone = createApiThunk<TloginWithPhoneData, TVerifyrespone>({
  name: "auth/Login-by-phone",
  url: LoginByPhoneUrl,
});
