import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { useNetwork } from "./useNetwork"
import { Client } from "@mintlayer/sdk"

// Define the type for the options, excluding queryKey and queryFn
type UseXPubOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<Client["getXPub"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching the extended public key (xpub) for the current account
 * @param options - Optional useQuery options
 * @returns A query object containing the extended public key
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useXPub(options?: UseXPubOptions) {
  const client = useClient()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "xpub", network],
    queryFn: async () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getXPub()
    },
    ...options,
  })
}
