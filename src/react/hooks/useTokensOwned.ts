import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { MintlayerClient } from "../../types"
import { getAddressesHash } from "../../utils"
import { useNetwork } from "./useNetwork"

// Define the type for the options, excluding queryKey and queryFn
type UseTokensOwnedOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerClient["getTokensOwned"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching tokens owned by the current account
 * @param options - Optional useQuery options
 * @returns A query object containing the list of owned tokens
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useTokensOwned(options?: UseTokensOwnedOptions) {
  const client = useClient()
  const { data } = useAccount()
  const { network } = useNetwork()
  const addressesHash = getAddressesHash(data?.isConnected ? data?.address[network || "mainnet"] : null)

  return useQuery({
    queryKey: ["mintlayer", "tokensOwned", network, addressesHash],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getTokensOwned()
    },
    ...options,
  })
}
