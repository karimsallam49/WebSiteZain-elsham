

import type { TVerifyData, TVerifyrespone } from "../../../DTO/AuthDTO";
import { verifyOTPForgetPasswordUrl } from "../../../EndPoints/EndPoints";
import { createApiThunk } from "../../../Hooks/AuthThunk";





export const actVerifyForgetPasswordOTP = createApiThunk<TVerifyData, TVerifyrespone>({
  name: "auth/verify-forget-password-otp",
  url: verifyOTPForgetPasswordUrl,
});
