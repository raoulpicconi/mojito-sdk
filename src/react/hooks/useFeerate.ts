import { useQuery } from "@tanstack/react-query"
import { useConfig } from "./useConfig"
import { MintlayerAPIClient } from "../../api"
import { useNetwork } from "./useNetwork"
export interface UseFeerateParams {
  in_top_x_mb?: number
}

export function useFeerate(params?: UseFeerateParams) {
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "feerate", network, params],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getFeerate(params)
    },
  })
}
