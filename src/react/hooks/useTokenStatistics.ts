import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseTokenStatisticsParams {
  tokenId: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseTokenStatisticsOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getTokenStatistics"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching statistics for a specific token
 * @param params - Parameters for fetching token statistics
 * @param params.tokenId - The ID of the token to fetch statistics for
 * @param options - Optional useQuery options
 * @returns A query object containing the token statistics
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useTokenStatistics(params: UseTokenStatisticsParams, options?: UseTokenStatisticsOptions) {
  const { tokenId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "tokenStatistics", network, tokenId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getTokenStatistics(tokenId)
    },
    // Spread the additional options
    ...options,
  })
}
