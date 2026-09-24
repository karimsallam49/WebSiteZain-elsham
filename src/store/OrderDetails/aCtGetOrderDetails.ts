import type { OrderDetalsDTO } from "../../DTO/OrderDTO";
import { GeOrderDetailsUrl } from "../../EndPoints/EndPoints";
import { createApiThunk } from "../../Hooks/AuthThunk";






export const actOrderDetails = createApiThunk<OrderDetalsDTO, any>({
  name: "GetOrderDetails/",
  url: GeOrderDetailsUrl,
});
