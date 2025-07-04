import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { useNetwork } from "./useNetwork"
import { useAddressesHash } from "./useAddressesHash"
import { Client } from "@mintlayer/sdk"

// Define the type for the options, excluding queryKey and queryFn
type UseAccountOrdersOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<Client["getAccountOrders"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching orders associated with the current account
 * @param options - Optional useQuery options
 * @returns A query object containing the list of account orders
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useAccountOrders(
  options?: UseAccountOrdersOptions,
): UseQueryResult<Awaited<ReturnType<Client["getAccountOrders"]>>, Error> {
  const client = useClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()
  const { data: addressesHash, isSuccess: isHashReady } = useAddressesHash()

  const currentNetwork = network || "mainnet"

  return useQuery({
    queryKey: ["mintlayer", "accountOrders", currentNetwork, addressesHash],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getAccountOrders()
    },
    enabled: !!accountData?.isConnected && isHashReady && !!addressesHash,
    // Spread the additional options, allowing override of 'enabled'
    ...options,
  })
}
