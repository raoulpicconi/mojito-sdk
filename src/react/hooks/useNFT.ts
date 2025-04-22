import { useQuery } from "@tanstack/react-query"
import { useConfig } from "./useConfig"
import { MintlayerAPIClient } from "../../api"
import { useNetwork } from "./useNetwork"

export interface UseNFTParams {
  id: string
}

export function useNFT(params: UseNFTParams) {
  const { id } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "nft", network, id],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getNFT(id)
    },
  })
}
