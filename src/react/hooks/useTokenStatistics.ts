import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseTokenStatisticsParams {
  tokenId: string
}

/**
 * Hook for fetching statistics for a specific token
 * @param params - Parameters for fetching token statistics
 * @param params.tokenId - The ID of the token to fetch statistics for
 * @returns A query object containing the token statistics
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useTokenStatistics(params: UseTokenStatisticsParams) {
  const { tokenId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "tokenStatistics", network, tokenId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getTokenStatistics(tokenId)
    },
  })
}
