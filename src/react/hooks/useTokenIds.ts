import { MintlayerAPIClient } from "../../api"
import { useQuery } from "@tanstack/react-query"
import { PaginationParams } from "../../index.d"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"

export interface UseTokenIdsParams {
  pagination?: PaginationParams
}

export function useTokenIds(params: UseTokenIdsParams) {
  const { pagination } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "tokenIds", network, pagination],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getTokenIds(pagination)
    },
  })
}
