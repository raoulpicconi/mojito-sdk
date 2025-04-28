import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { MintlayerClient } from "../../types"
import { useNetwork } from "./useNetwork"
import { useAddressesHash } from "./useAddressesHash"

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
  const { network } = useNetwork()
  const { data: addressesHash, isSuccess: isHashReady } = useAddressesHash()
  const { data: accountData } = useAccount()

  const currentNetwork = network || "mainnet"

  return useQuery({
    queryKey: ["mintlayer", "availableOrders", currentNetwork, addressesHash],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getAvailableOrders()
    },
    enabled: !!client && isHashReady,
    ...options,
  })
}
