import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

// Define the type for the options, excluding queryKey and queryFn
type UseCoinStatisticsOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getCoinStatistics"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching coin statistics
 * @param options - Optional useQuery options
 * @returns A query object containing coin statistics information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useCoinStatistics(options?: UseCoinStatisticsOptions) {
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "coinStatistics", network],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getCoinStatistics()
    },
    // Spread the additional options
    ...options,
  })
}
