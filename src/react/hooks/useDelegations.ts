import { useQuery } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { useAccount } from "./useAccount"

/**
 * Hook for fetching all delegations for the current account
 * @returns A query object containing the list of delegations
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useDelegations() {
  const client = useClient()
  const { data } = useAccount()

  return useQuery({
    queryKey: ["mintlayer", "delegations", data?.isConnected ? data?.address : null],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getDelegations()
    },
    enabled: data?.isConnected,
  })
}
