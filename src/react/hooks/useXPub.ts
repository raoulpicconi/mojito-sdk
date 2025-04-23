import { useQuery } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { useNetwork } from "./useNetwork"

/**
 * Hook for fetching the extended public key (xpub) for the current account
 * @returns A query object containing the extended public key
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useXPub() {
  const client = useClient()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "xpub", network],
    queryFn: async () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getXPub()
    },
  })
}
