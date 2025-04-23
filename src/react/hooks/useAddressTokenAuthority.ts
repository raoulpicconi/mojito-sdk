import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseAddressTokenAuthorityParams {
  address: string
}

/**
 * Hook for fetching token authority information for a specific address
 * @param params - Parameters for fetching address token authority
 * @param params.address - The address to fetch token authority for
 * @returns A query object containing the token authority information for the specified address
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useAddressTokenAuthority(params: UseAddressTokenAuthorityParams) {
  const { address } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "addressTokenAuthority", network, address],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getAddressTokenAuthority(address)
    },
  })
}
