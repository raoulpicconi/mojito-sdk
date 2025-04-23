import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

// Define the type for the options, excluding queryKey and queryFn
type UseFeerateOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getFeerate"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching the current network fee rate
 * @param options - Optional useQuery options
 * @returns A query object containing the current network fee rate
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useFeerate(options?: UseFeerateOptions) {
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "feerate", network],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getFeerate()
    },
    // Spread the additional options
    ...options,
  })
}
