import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { MintlayerClient } from "../../types"
import { useNetwork } from "./useNetwork"
import { useAddressesHash } from "./useAddressesHash"

// Define the type for the options, excluding queryKey and queryFn
type UseBalanceOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerClient["getBalance"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching the balance of the current account
 * @param options - Optional useQuery options
 * @returns A query object containing the account balance
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useBalance(options?: UseBalanceOptions) {
  const client = useClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()
  const { data: addressesHash, isSuccess: isHashReady } = useAddressesHash()

  const currentNetwork = network || "mainnet"

  return useQuery({
    queryKey: ["mintlayer", "balance", currentNetwork, addressesHash],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getBalance()
    },
    enabled: !!accountData?.isConnected && isHashReady && !!addressesHash,
    ...options,
  })
}
