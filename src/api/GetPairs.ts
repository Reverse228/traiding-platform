import { useApiCalls } from "@/utils/hooks/useApiCalls";

export type GetPairsApi = {
  baseCurrency: string;
  quoteCurrency: string;
  type: string;
  lastPrice: number;
}[];

export const useGetPairs = () => {
  const { data, isLoading, status } = useApiCalls<GetPairsApi, GetPairsApi>(
    "pairs",
    {
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    undefined,
    true,
  );

  return { data, isLoading, status };
};
