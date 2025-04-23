import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseBlockParams {
  id: string
}

export function useBlock(params: UseBlockParams) {
  const { id } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()
  return useQuery({
    queryKey: ["mintlayer", "block", network, id],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getBlock(id)
    },
  })
}
