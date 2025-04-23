import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClient } from "../../index.d"

// Define the type for the options, excluding queryKey and queryFn
type UseDelegationTotalOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerClient["getDelegationsTotal"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching the total delegation amount for the current account
 * @param options - Optional useQuery options
 * @returns A query object containing the total delegation amount
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useDelegationTotal(options?: UseDelegationTotalOptions) {
  const client = useClient()
  const { data } = useAccount()

  return useQuery({
    queryKey: ["mintlayer", "delegationsTotal", data?.isConnected ? data?.address : null],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getDelegationsTotal()
    },
    enabled: data?.isConnected,
    // Spread the additional options, allowing override of 'enabled'
    ...options,
  })
}
