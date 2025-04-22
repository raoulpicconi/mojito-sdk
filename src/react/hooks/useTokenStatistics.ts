import { useQuery } from "@tanstack/react-query"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"
import { MintlayerAPIClient } from "../../api"

export interface UseTokenStatisticsParams {
  tokenId: string
}

export function useTokenStatistics(params: UseTokenStatisticsParams) {
  const { tokenId } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "statistics", "token", network, tokenId],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getTokenStatistics(tokenId)
    },
  })
}
