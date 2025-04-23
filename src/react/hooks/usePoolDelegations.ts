import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UsePoolDelegationsParams {
  poolId: string
}

/**
 * Hook for fetching delegations for a specific pool
 * @param params - Parameters for fetching pool delegations
 * @param params.poolId - The ID of the pool to fetch delegations for
 * @returns A query object containing the list of delegations for the specified pool
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function usePoolDelegations(params: UsePoolDelegationsParams) {
  const { poolId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "poolDelegations", network, poolId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getPoolDelegations(poolId)
    },
  })
}
