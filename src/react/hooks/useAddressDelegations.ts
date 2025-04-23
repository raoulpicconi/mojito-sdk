import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseAddressDelegationsParams {
  address: string
}

/**
 * Hook for fetching delegations associated with a specific address
 * @param params - Parameters for fetching address delegations
 * @param params.address - The address to fetch delegations for
 * @returns A query object containing the list of delegations for the specified address
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useAddressDelegations(params: UseAddressDelegationsParams) {
  const { address } = params
  const apiClient = useApiClient()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "addressDelegations", network, address],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getAddressDelegations(address)
    },
  })
}
