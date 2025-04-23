import { useQuery } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"

/**
 * Hook for fetching tokens owned by the current account
 * @returns A query object containing the list of owned tokens
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useTokensOwned() {
  const client = useClient()
  const { data } = useAccount()

  return useQuery({
    queryKey: ["mintlayer", "tokensOwned", data?.isConnected ? data?.address : null],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getTokensOwned()
    },
  })
}
