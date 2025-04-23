import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { MintlayerClient } from "../../index.d"

export interface UseOrderDetailsParams {
  order_id: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseOrderDetailsOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerClient["fetchOrderDetails"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching details of a specific order
 * @param params - Parameters for fetching order details
 * @param params.order_id - The ID of the order to fetch details for
 * @param options - Optional useQuery options
 * @returns A query object containing the order details
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useOrderDetails(params: UseOrderDetailsParams, options?: UseOrderDetailsOptions) {
  const client = useClient()

  return useQuery({
    queryKey: ["mintlayer", "orderDetails", params.order_id],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.fetchOrderDetails(params)
    },
    ...options,
  })
}
