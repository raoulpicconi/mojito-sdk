import { useQuery } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { useAccount } from "./useAccount"

/**
 * Hook for fetching available orders in the marketplace
 * @returns A query object containing the list of available orders
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useAvailableOrders() {
  const client = useClient()
  const { data } = useAccount()

  return useQuery({
    queryKey: ["mintlayer", "available-orders", data?.isConnected ? data?.address : null],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getAvailableOrders()
    },
    enabled: data?.isConnected,
  })
}
