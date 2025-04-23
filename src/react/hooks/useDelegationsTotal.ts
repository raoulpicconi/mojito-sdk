import { useQuery } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"

/**
 * Hook for fetching the total delegation amount for the current account
 * @returns A query object containing the total delegation amount
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useDelegationTotal() {
  const client = useClient()
  const { data } = useAccount()

  return useQuery({
    queryKey: ["mintlayer", "delegation-total", data?.isConnected ? data?.address : null],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getDelegationsTotal()
    },
    enabled: data?.isConnected,
  })
}
