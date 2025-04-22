import { useQuery } from "@tanstack/react-query"
import { MintlayerAPIClient } from "../../api"

import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"

export function useCoinStatistics() {
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "statistics", "coin", network],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getCoinStatistics()
    },
  })
}
