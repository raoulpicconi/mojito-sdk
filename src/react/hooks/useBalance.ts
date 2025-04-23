import { useQuery } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"

/**
 * Hook for fetching the current account's balance
 * @returns A query object containing the account's balance information
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useBalance() {
  const client = useClient()
  const { data } = useAccount()

  return useQuery({
    queryKey: ["mintlayer", "balance", data?.isConnected ? data?.address : null],
    queryFn: async () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getBalance()
    },
    enabled: data?.isConnected,
  })
}
