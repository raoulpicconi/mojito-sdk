import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseOrderParams {
  orderId: string
}

/**
 * Hook for fetching order information
 * @param params - Parameters for fetching order information
 * @param params.orderId - The ID of the order to fetch
 * @returns A query object containing the order information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useOrder(params: UseOrderParams) {
  const { orderId } = params
  const apiClient = useApiClient()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "order", network, orderId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getOrder(orderId)
    },
  })
}
