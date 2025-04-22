import { useQuery } from "@tanstack/react-query"
import { MintlayerAPIClient } from "../../api"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"

export interface UseBlockHeaderParams {
  id: string
}

export function useBlockHeader(params: UseBlockHeaderParams) {
  const { id } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "blockHeader", network, id],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getBlockHeader(id)
    },
  })
}
