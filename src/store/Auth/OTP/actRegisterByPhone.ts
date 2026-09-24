

import type { TRegisturePhoneData, TVerifyrespone } from "../../../DTO/AuthDTO";
import { RegisterByPhoneUrl } from "../../../EndPoints/EndPoints";
import { createApiThunk } from "../../../Hooks/AuthThunk";





export const actRegisterByPhone = createApiThunk<TRegisturePhoneData, TVerifyrespone>({
  name: "auth/register-by-phone",
  url: RegisterByPhoneUrl,
});
