import { AxiosError } from "axios";
import { useMutationSideEffects } from "@/utils/hooks/useMutationSideEffects";
import { axiosMutation } from "@/utils/functions/axiosMutation";

export const useLogInUser = () => {
  const { executeMutation, isSuccess, data, isLoading, status, error } =
    useMutationSideEffects<
      { accessToken: string },
      { email: string; password: string }
    >({
      onExecuteMutation: async (data) =>
        await axiosMutation("post", `auth/login`, data, undefined, true),
      refetchQueries: ["auth/me"],
      options: {
        onError: (data) => {},
      },
    });

  return {
    executeMutation,
    isSuccess,
    data,
    isLoading,
    status,
    error: error as AxiosError<any>,
  };
};
