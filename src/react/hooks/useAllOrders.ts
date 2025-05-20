import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

// Define the type for the options, excluding queryKey and queryFn
type UseAllOrdersOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getOrders"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching all orders in the marketplace
 * @param options - Optional useQuery options
 * @returns A query object containing the list of all orders
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useAllOrders(options?: UseAllOrdersOptions) {
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "orders", network],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getOrders()
    },
    // Spread the additional options
    ...options,
  })
}
