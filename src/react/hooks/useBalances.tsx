import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { useNetwork } from "./useNetwork"
import { useAddressesHash } from "./useAddressesHash"
import { Client } from "@mintlayer/sdk"

// Define the type for the options, excluding queryKey and queryFn
type UseBalancesOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<Client["getBalances"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching Coin and tokens balances of the current account
 * @param options - Optional useQuery options
 * @returns A query object containing the account balances
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useBalances(options?: UseBalancesOptions) {
  const client = useClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()
  const { data: addressesHash, isSuccess: isHashReady } = useAddressesHash()

  const currentNetwork = network || "mainnet"

  return useQuery({
    queryKey: ["mintlayer", "balances", currentNetwork, addressesHash],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getBalances()
    },
    enabled: !!accountData?.isConnected && isHashReady && !!addressesHash,
    ...options,
  })
}
