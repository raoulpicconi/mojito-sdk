import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseDelegationParams {
  delegationId: string
}

/**
 * Hook for fetching delegation information
 * @param params - Parameters for fetching delegation
 * @param params.delegationId - The ID of the delegation to fetch
 * @returns A query object containing the delegation data
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useDelegation(params: UseDelegationParams) {
  const { delegationId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "delegation", network, delegationId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getDelegation(delegationId)
    },
  })
}
