import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseAddressTokenAuthorityParams {
  address: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseAddressTokenAuthorityOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getAddressTokenAuthority"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching token authority information for a specific address
 * @param params - Parameters for fetching address token authority
 * @param params.address - The address to fetch token authority for
 * @param options - Optional useQuery options
 * @returns A query object containing the token authority information for the specified address
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useAddressTokenAuthority(
  params: UseAddressTokenAuthorityParams,
  options?: UseAddressTokenAuthorityOptions,
) {
  const { address } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "addressTokenAuthority", network, address],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getAddressTokenAuthority(address)
    },
    // Spread the additional options
    ...options,
  })
}
