import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { useAddressesHash } from "./useAddressesHash"
import { MintlayerClient } from "../../types"
import { useNetwork } from "./useNetwork"

// Define the type for the options, excluding queryKey and queryFn
type UseDelegationsOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerClient["getDelegations"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching delegations associated with the current account
 * @param options - Optional useQuery options
 * @returns A query object containing the list of delegations
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useDelegations(options?: UseDelegationsOptions) {
  const client = useClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()
  const { data: addressesHash, isSuccess: isHashReady } = useAddressesHash()

  const currentNetwork = network || "mainnet"

  return useQuery({
    queryKey: ["mintlayer", "delegations", currentNetwork, addressesHash],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      if (!isHashReady || !addressesHash) {
        return Promise.reject(new Error("Hash not ready"))
      }
      return client.getDelegations()
    },
    enabled: !!accountData?.isConnected && isHashReady && !!addressesHash,
    ...options,
  })
}
