import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

/**
 * Hook for fetching coin statistics
 * @returns A query object containing coin statistics information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useCoinStatistics() {
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "coinStatistics", network],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getCoinStatistics()
    },
  })
}
