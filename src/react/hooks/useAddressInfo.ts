import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseAddressInfoParams {
  address: string
}

/**
 * Hook for fetching information about a specific address
 * @param params - Parameters for fetching address information
 * @param params.address - The address to fetch information for
 * @returns A query object containing the address information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useAddressInfo(params: UseAddressInfoParams) {
  const { address } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "addressInfo", network, address],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getAddress(address)
    },
  })
}
