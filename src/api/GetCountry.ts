import { useApiCalls } from "@/utils/hooks/useApiCalls";

export const useGetCountry = () => {
  const { data, isSuccess, isLoading } = useApiCalls<string[], string[]>(
    "auth/countries",
  );

  return { data, isSuccess, isLoading };
};
