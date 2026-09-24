import type { NoticicationsDTO } from "../../DTO/NoticicationsDTO";
import { notificationsUrl } from "../../EndPoints/EndPoints";
import { createAppAsyncThunk } from "../FetchData/FetchData";

// ✅ ثنك عام بيجيب الإشعارات من الـ API
export const actNotifications = createAppAsyncThunk<NoticicationsDTO[]>(
  "notifications/fetch",
  notificationsUrl
);
