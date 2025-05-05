import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { Client } from "@mintlayer/sdk"
import { useNetwork } from "./useNetwork"
import { useAddressesHash } from "./useAddressesHash"

// Define the type for the options, excluding queryKey and queryFn
type UseDelegationsTotalOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<Client["getDelegationsTotal"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching the total delegations for the current account
 * @param options - Optional useQuery options
 * @returns A query object containing the total delegations
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useDelegationsTotal(options?: UseDelegationsTotalOptions) {
  const client = useClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()
  const { data: addressesHash, isSuccess: isHashReady } = useAddressesHash()

  const currentNetwork = network || "mainnet"

  return useQuery({
    queryKey: ["mintlayer", "delegationsTotal", currentNetwork, addressesHash],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      if (!isHashReady || !addressesHash) {
        return Promise.reject(new Error("Hash not ready"))
      }
      return client.getDelegationsTotal()
    },
    enabled: !!accountData?.isConnected && isHashReady && !!addressesHash,
    ...options,
  })
}
