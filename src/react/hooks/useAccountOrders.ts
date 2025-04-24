import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { MintlayerClient } from "../../types"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

// Define the type for the options, excluding queryKey and queryFn
type UseAccountOrdersOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerClient["getAccountOrders"]>>,
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
export function useAccountOrders(options?: UseAccountOrdersOptions) {
  const client = useClient()
  const { data } = useAccount()
  const { network } = useNetwork()

  const addressesHash = getAddressesHash(data?.isConnected ? data?.address[network || "mainnet"] : null)

  return useQuery({
    queryKey: ["mintlayer", "accountOrders", network, addressesHash],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getAccountOrders()
    },
    enabled: data?.isConnected,
    // Spread the additional options, allowing override of 'enabled'
    ...options,
  })
}
