import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

/**
 * Hook for fetching all orders in the marketplace
 * @returns A query object containing the list of all orders
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useOrders() {
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "orders", network],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getOrders()
    },
  })
}
