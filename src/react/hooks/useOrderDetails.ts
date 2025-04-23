import { useQuery } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"

export interface UseOrderDetailsParams {
  order_id: string
}

/**
 * Hook for fetching details of a specific order
 * @param params - Parameters for fetching order details
 * @param params.order_id - The ID of the order to fetch details for
 * @returns A query object containing the order details
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useOrderDetails(params: UseOrderDetailsParams) {
  const client = useClient()

  return useQuery({
    queryKey: ["mintlayer", "orderDetails", params.order_id],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.fetchOrderDetails(params)
    },
  })
}
