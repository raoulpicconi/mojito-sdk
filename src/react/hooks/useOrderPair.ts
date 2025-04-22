import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"
import { MintlayerAPIClient } from "../../api"
import { PaginationParams } from "../../index.d"
import { useQuery } from "@tanstack/react-query"

export interface UseOrderPairParams {
  pair: string
  pagination?: PaginationParams
}

export function useOrderPair(params: UseOrderPairParams) {
  const { pair, pagination } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "orderPair", network, pair, pagination],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getOrderPair(pair, pagination)
    },
  })
}
