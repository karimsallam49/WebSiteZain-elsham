import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAppSelector } from "./hooks";

export const usePost = <TResponse, TBody = any>(
  currentLang: "ar" | "en",
  url: string
) => {
    const {selectedBranch}=useAppSelector((state)=>state.restaurantSettingsSlice)
  
  const postData = async (body: TBody): Promise<TResponse> => {
    const res = await axios.post(url, body, {
      headers: {
        Authorization: "Bearer null",
        "Branch-id": selectedBranch,
        "x-localization": currentLang ?? "en",
      },
    });
    return res.data;
  };

  return useMutation<TResponse, Error, TBody>({
    mutationFn: postData,
  });
};
