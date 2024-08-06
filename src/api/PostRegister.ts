import { useMutationSideEffects } from "@/utils/hooks/useMutationSideEffects";
import { axiosMutation } from "@/utils/functions/axiosMutation";

export const usePostRegister = () => {
  const { executeMutation, isSuccess, data, status, isLoading } =
    useMutationSideEffects<
      any,
      {
        email: string;
        password: string;
        phone: string;
        country: string;
        name: string;
      }
    >({
      onExecuteMutation: async (data) =>
        await axiosMutation("post", `auth/register`, data),
      refetchQueries: ["auth/me"],
    });

  return { executeMutation, isSuccess, data, status, isLoading };
};
