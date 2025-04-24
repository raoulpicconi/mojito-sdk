import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClient } from "../../types"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

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
  const { network } = useNetwork()
  const addressesHash = getAddressesHash(data?.isConnected ? data?.address[network || "mainnet"] : null)

  return useQuery({
    queryKey: ["mintlayer", "delegationsTotal", network, addressesHash],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getDelegationsTotal()
    },
    enabled: data?.isConnected,
    ...options,
  })
}
