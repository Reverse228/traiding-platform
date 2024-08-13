import { useMutationSideEffects } from "@/utils/hooks/useMutationSideEffects";
import { axiosMutation } from "@/utils/functions/axiosMutation";

export type PostCancelOrder = {
  orderId: string | null;
};

export const usePostCancelOrder = () => {
  const { executeMutation, status } = useMutationSideEffects<
    any,
    PostCancelOrder
  >({
    onExecuteMutation: async (data) =>
      await axiosMutation("post", `orders/cancel?orderId=${data.orderId}`),
    refetchQueries: ["auth/me"],
  });

  return { executeMutation, status };
};
