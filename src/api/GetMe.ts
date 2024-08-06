import { useApiCalls } from "@/utils/hooks/useApiCalls";

export type MeUserApi = {
  id: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  name: string | null;
  role: string | null;
  assetBalances: [
    {
      id: string;
      currency: string | null;
      balance: number | null;
      frozenBalance: number | null;
      activePair: any | null;
      walletAddress: string | null;
    },
  ];
  orders: [
    {
      id: string | null;
      activePair: {
        baseCurrency: string | null;
        lastPrice: number | null;
        type: string;
        quoteCurrency: string | null;
      };
      amount: number | null;
      price: number | null;
      orderType:
        | "BUY"
        | "SELL"
        | "BUY_LIMIT"
        | "SELL_LIMIT"
        | "BUY_STOP"
        | "SELL_STOP";
      orderCategory: "OPTIONS" | "MARGIN" | "SPOT" | "FUTURES";
      margin: number | null;
      orderStatus: string | null;
      timestamp: string | null;
    },
  ];
  depositWallet: string | null;
};

export const useGetMe = () => {
  const { data, isSuccess, isLoading, status } = useApiCalls<
    MeUserApi,
    MeUserApi
  >("auth/me");

  return { data, isSuccess, isLoading, status };
};
