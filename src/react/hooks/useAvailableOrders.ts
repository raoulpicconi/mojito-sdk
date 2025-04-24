import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { useAccount } from "./useAccount"
import { MintlayerClient } from "../../types"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

// Define the type for the options, excluding queryKey and queryFn
type UseAvailableOrdersOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerClient["getAvailableOrders"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching available orders in the marketplace
 * @param options - Optional useQuery options
 * @returns A query object containing the list of available orders
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useAvailableOrders(options?: UseAvailableOrdersOptions) {
  const client = useClient()
  const { data } = useAccount()
  const { network } = useNetwork()

  const addressesHash = getAddressesHash(data?.isConnected ? data?.address[network || "mainnet"] : null)

  return useQuery({
    queryKey: ["mintlayer", "availableOrders", network, addressesHash],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getAvailableOrders()
    },
    enabled: data?.isConnected,
    ...options,
  })
}
