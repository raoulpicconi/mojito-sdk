import { useQuery } from "@tanstack/react-query"
import { MintlayerAPIClient } from "../../api"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"

export function useChainTip() {
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "chainTip", network],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getChainTip()
    },
  })
}
