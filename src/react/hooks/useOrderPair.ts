import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"
import { PaginationParams } from "../../types"

export interface UseOrderPairParams {
  pair: string
  pagination?: PaginationParams
}

// Define the type for the options, excluding queryKey and queryFn
type UseOrderPairOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getOrderPair"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching orders for a specific trading pair
 * @param params - Parameters for fetching order pair information
 * @param params.pair - The trading pair to fetch orders for
 * @param params.pagination - Optional pagination parameters
 * @param options - Optional useQuery options
 * @returns A query object containing the list of orders for the specified pair
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useOrderPair(params: UseOrderPairParams, options?: UseOrderPairOptions) {
  const { pair, pagination } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "orderPair", network, pair, pagination],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getOrderPair(pair, pagination)
    },
    // Spread the additional options
    ...options,
  })
}
