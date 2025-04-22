import { useQuery } from "@tanstack/react-query"
import { MintlayerAPIClient } from "../../api"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"

export interface UseBlockRewardParams {
  id: string
}

export function useBlockReward(params: UseBlockRewardParams) {
  const { id } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "blockReward", network, id],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getBlockReward(id)
    },
  })
}
