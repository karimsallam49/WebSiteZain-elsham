
import type { Tformdata, TResponse } from "../../../DTO/AuthDTO";
import { createApiThunk } from "../../../Hooks/AuthThunk";



export const actregisture = createApiThunk<Tformdata, TResponse>({
  name: "auth/register",
  url: "http://localhost:3000/register",
});