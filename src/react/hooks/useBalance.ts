import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { MintlayerClient } from "../../types"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

// Define the type for the options, excluding queryKey and queryFn
type UseBalanceOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerClient["getBalance"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching the current account's balance
 * @param options - Optional useQuery options
 * @returns A query object containing the account's balance information
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useBalance(options?: UseBalanceOptions) {
  const client = useClient()
  const { data } = useAccount()
  const { network } = useNetwork()

  const addressesHash = getAddressesHash(data?.isConnected ? data?.address[network || "mainnet"] : null)

  return useQuery({
    queryKey: ["mintlayer", "balance", network, addressesHash],
    queryFn: async () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getBalance()
    },
    enabled: data?.isConnected,
    ...options,
  })
}
