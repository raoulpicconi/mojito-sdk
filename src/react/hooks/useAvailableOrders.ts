import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { useAccount } from "./useAccount"
import { MintlayerClient } from "../../index.d"

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

  return useQuery({
    queryKey: ["mintlayer", "availableOrders", data?.isConnected ? data?.address : null],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getAvailableOrders()
    },
    enabled: data?.isConnected,
    // Spread the additional options, allowing override of 'enabled'
    ...options,
  })
}
