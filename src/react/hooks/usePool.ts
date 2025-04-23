import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UsePoolParams {
  poolId: string
}

/**
 * Hook for fetching pool information
 * @param params - Parameters for fetching pool information
 * @param params.poolId - The ID of the pool to fetch
 * @returns A query object containing the pool information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function usePool(params: UsePoolParams) {
  const { poolId } = params
  const apiClient = useApiClient()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "pool", network, poolId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getPool(poolId)
    },
  })
}
