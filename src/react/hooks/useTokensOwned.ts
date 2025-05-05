import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { useAddressesHash } from "./useAddressesHash"
import { Client } from "@mintlayer/sdk"
import { useNetwork } from "./useNetwork"

// Define the type for the options, excluding queryKey and queryFn
type UseTokensOwnedOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<Client["getTokensOwned"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching tokens owned by the current account
 * @param options - Optional useQuery options
 * @returns A query object containing the list of tokens owned
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useTokensOwned(options?: UseTokensOwnedOptions) {
  const client = useClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()
  const { data: addressesHash, isSuccess: isHashReady } = useAddressesHash()

  const currentNetwork = network || "mainnet"

  return useQuery({
    queryKey: ["mintlayer", "tokensOwned", currentNetwork, addressesHash],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getTokensOwned()
    },
    enabled: !!accountData?.isConnected && isHashReady && !!addressesHash,
    ...options,
  })
}
