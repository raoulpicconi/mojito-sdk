import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"
import { PaginationParams } from "../../index.d"

export interface UseOrderPairParams {
  pair: string
  pagination?: PaginationParams
}

export function useOrderPair(params: UseOrderPairParams) {
  const { pair, pagination } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "orderPair", network, pair, pagination],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getOrderPair(pair, pagination)
    },
  })
}
