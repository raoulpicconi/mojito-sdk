import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"
import { TimeFilter } from "../../index.d"

export interface UsePoolBlockStatsParams {
  poolId: string
  timeFilter: TimeFilter
}

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
