import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"
import { TimeFilter } from "../../index.d"

export interface UsePoolBlockStatsParams {
  poolId: string
  timeFilter: TimeFilter
}

/**
 * Hook for fetching block statistics for a specific pool
 * @param params - Parameters for fetching pool block statistics
 * @param params.poolId - The ID of the pool to fetch statistics for
 * @param params.timeFilter - The time filter to apply to the statistics
 * @returns A query object containing the pool's block statistics
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function usePoolBlockStats(params: UsePoolBlockStatsParams) {
  const { poolId, timeFilter } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "poolBlockStats", network, poolId, timeFilter],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getPoolBlockStats(poolId, timeFilter)
    },
  })
}
