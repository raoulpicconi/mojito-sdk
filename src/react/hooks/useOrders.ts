import { useQueries, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseOrdersParams {
  orderIds: string[]
}

// Define the type for the options, excluding queryKey and queryFn
type UseOrdersOptions = Omit<
  // We need to determine the return type of the query function and the error type
  // Assuming the query function returns what apiClient.getOrder returns and error is Error
  // This might need adjustment based on the actual return type and error handling
  UseQueryOptions<
    // Placeholder for the actual return type of apiClient.getOrder
    // Let's assume it returns 'any' for now if we don't know the exact type
    // Ideally, import the specific return type from where apiClient.getOrder is defined
    Awaited<ReturnType<MintlayerAPIClient["getOrder"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching orders informations
 * @param params - Parameters for fetching orders informations
 * @param params.orderIds - The IDs of the orders to fetch
 * @param options - Optional useQuery options
 * @returns A query object containing the orders informations
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useOrders(params: UseOrdersParams, options?: UseOrdersOptions) {
  const { orderIds } = params
  const apiClient = useApiClient()
  const { network } = useNetwork()

  return useQueries({
    queries: orderIds.map((orderId) => ({
      queryKey: ["mintlayer", "order", network, orderId],
      queryFn: () => {
        if (!apiClient) throw new MintlayerApiClientNotFoundError()
        return apiClient.getOrder(orderId)
      },
      ...options,
    })),
  })
}
