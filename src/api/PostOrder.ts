import { useMutationSideEffects } from "@/utils/hooks/useMutationSideEffects";
import { axiosMutation } from "@/utils/functions/axiosMutation";

export type SendOrderProps = {
  pair: string;
  amount: number;
  price: number;
  orderType:
    | "BUY"
    | "SELL"
    | "BUY_LIMIT"
    | "SELL_LIMIT"
    | "BUY_STOP"
    | "SELL_STOP";
  orderCategory: "MARGIN" | "SPOT" | "FUTURES" | "OPTIONS";
  margin: number;
};

export const usePostOrder = () => {
  const { executeMutation, data, status } = useMutationSideEffects<
    any,
    SendOrderProps
  >({
    onExecuteMutation: async (data) =>
      await axiosMutation("post", `orders`, data),
    refetchQueries: ["auth/me"],
  });

  return { executeMutation, data, status };
};
