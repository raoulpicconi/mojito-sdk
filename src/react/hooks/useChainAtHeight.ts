import { useQuery } from "@tanstack/react-query"
import { MintlayerAPIClient } from "../../api"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"

export interface UseChainAtHeightParams {
  height: string
}

export function useChainAtHeight(params: UseChainAtHeightParams) {
  const { height } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "chainAtHeight", network, height],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getChainAtHeight(height)
    },
  })
}
