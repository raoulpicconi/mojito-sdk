import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"
import { useQuery } from "@tanstack/react-query"
import { TimeFilter } from "../../index.d"
import { MintlayerAPIClient } from "../../api"

export interface UsePoolBlockStatsParams {
  id: string
  timeFilter: TimeFilter
}

export function usePoolBlockStats(params: UsePoolBlockStatsParams) {
  const { id, timeFilter } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "poolBlockStats", network, id, timeFilter],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getPoolBlockStats(id, timeFilter)
    },
  })
}
