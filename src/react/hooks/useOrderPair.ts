import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"
import { PaginationParams } from "../../index.d"

export interface UseOrderPairParams {
  pair: string
  pagination?: PaginationParams
}

/**
 * Hook for fetching orders for a specific trading pair
 * @param params - Parameters for fetching order pair information
 * @param params.pair - The trading pair to fetch orders for
 * @param params.pagination - Optional pagination parameters
 * @returns A query object containing the list of orders for the specified pair
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
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
