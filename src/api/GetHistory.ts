import { useApiCalls } from "@/utils/hooks/useApiCalls";

export type GetPositions = {
  activePair: {
    baseCurrency: string;
    lastPrice: number;
    quoteCurrency: string;
    type: string;
  };
  amount: number;
  entryPrice: number;
  exitPrice: number;
  id: string;
  status: string;
  timestamp: string;
  order: {
    activePair: {
      baseCurrency: string;
      lastPrice: number;
      quoteCurrency: string;
      type: string;
    };
    amount: number;
    id: string;
    margin: number;
    orderCategory: string;
    orderStatus: string;
    orderType: string;
    price: number;
    timestamp: string;
  };
};

export const useGetHistory = () => {
  const { data, status } = useApiCalls<any, GetPositions[]>("positions");

  return { data, status };
};
