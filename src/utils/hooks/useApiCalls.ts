import { useQuery } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";

import type { UseQueryOptions } from "react-query";
import { API_URL } from "../constants";

export function useApiCalls<GetProps, ReturnProps>(
  url: string,
  options?: UseQueryOptions<GetProps, Error, ReturnProps>,
  params?: object,
  tokenNotRequired?: boolean,
) {
  const clearUrl = url.startsWith("/") ? url.substring(1) : url;

  const token = Cookies.get("token");

  const fetchData = (url: string, params?: object) => {
    return axios
      .get(`${API_URL}/${url}`, {
        params,
        headers: tokenNotRequired
          ? { "Content-Type": "application/json" }
          : {
              Authorization: token,
              "Content-Type": "application/json",
            },
      })
      .then((res) => res.data);
  };

  const { data, error, isLoading, isFetching, refetch, isSuccess, status } =
    useQuery<GetProps, Error, ReturnProps>(
      `${clearUrl}`,
      async () => await fetchData(clearUrl, params),
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: false,
        ...options,
      },
    );

  return { data, error, isLoading, isFetching, refetch, isSuccess, status };
}
