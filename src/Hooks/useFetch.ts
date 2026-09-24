import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAppSelector } from "./hooks";

export const useFetch = <T>(currrentlang:"ar"|"en",url: string,options?: { enabled?: boolean },token?:string) => {
  
  const {selectedBranch}=useAppSelector((state)=>state.restaurantSettingsSlice)
  const fetchData = async (): Promise<T> => {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Branch-id": selectedBranch,
        "x-localization":currrentlang??"en"
      },
    });
    return res.data;
  };

  return useQuery<T>({
    queryKey: ["fetch", url, currrentlang],
    queryFn: fetchData,
    enabled: options?.enabled ?? true,
  });
};
