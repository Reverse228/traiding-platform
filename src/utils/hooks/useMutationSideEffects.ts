import { useMutation, useQueryClient } from "react-query";

import type { AxiosError } from "axios";
import type { MutationFunction, MutationOptions } from "react-query";

type UseMutationSideEffectsOptions<DataResponse, Variables> = {
  onExecuteMutation: MutationFunction<DataResponse, Variables>;
  refetchQueries?: string[];
  options?: MutationOptions<
    DataResponse,
    AxiosError<DataResponse>,
    Variables,
    unknown
  >;
};

export const useMutationSideEffects = <DataResponse, Variables>({
  onExecuteMutation,
  refetchQueries,
  options,
}: UseMutationSideEffectsOptions<DataResponse, Variables>) => {
  const { onSuccess, onError, ...restOptions } = options || {};
  const queryClient = useQueryClient();

  const {
    data,
    mutate: executeMutation,
    error,
    reset,
    isLoading,
    status,
    isSuccess,
  } = useMutation(onExecuteMutation, {
    onSuccess: (data, variables, context) => {
      refetchQueries &&
        refetchQueries.map((key) =>
          queryClient.refetchQueries({
            queryKey: key,
          }),
        );

      onSuccess && onSuccess(data, variables, context);
    },

    onError: (error, variables, context) => {
      onError && onError(error, variables, context);
    },
    ...restOptions,
  });

  return {
    executeMutation,
    onSuccess,
    onError,
    error,
    reset,
    isLoading,
    data,
    status,
    isSuccess,
  };
};
