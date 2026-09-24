

import type { TVerifyData, TVerifyrespone } from "../../../DTO/AuthDTO";
import { verifyOTPUrl } from "../../../EndPoints/EndPoints";
import { createApiThunk } from "../../../Hooks/AuthThunk";





export const actVerifyPhone = createApiThunk<TVerifyData, TVerifyrespone>({
  name: "auth/verify-phone",
  url: verifyOTPUrl,
});
