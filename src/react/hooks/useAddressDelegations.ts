import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseAddressDelegationsParams {
  address: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseAddressDelegationsOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getAddressDelegations"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching delegations associated with a specific address
 * @param params - Parameters for fetching address delegations
 * @param params.address - The address to fetch delegations for
 * @param options - Optional useQuery options
 * @returns A query object containing the list of delegations for the specified address
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useAddressDelegations(params: UseAddressDelegationsParams, options?: UseAddressDelegationsOptions) {
  const { address } = params
  const apiClient = useApiClient()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "addressDelegations", network, address],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getAddressDelegations(address)
    },
    // Spread the additional options
    ...options,
  })
}
