import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { useAccount } from "./useAccount"
import { MintlayerClient } from "../../types"
import { getAddressesHash } from "../../utils"
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
 * Hook for fetching all delegations for the current account
 * @param options - Optional useQuery options
 * @returns A query object containing the list of delegations
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useDelegations(options?: UseDelegationsOptions) {
  const client = useClient()
  const { data } = useAccount()
  const { network } = useNetwork()
  const addressesHash = getAddressesHash(data?.isConnected ? data?.address[network || "mainnet"] : null)

  return useQuery({
    queryKey: ["mintlayer", "delegations", network, addressesHash],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getDelegations()
    },
    enabled: data?.isConnected,
    // Spread the additional options, allowing override of 'enabled'
    ...options,
  })
}
