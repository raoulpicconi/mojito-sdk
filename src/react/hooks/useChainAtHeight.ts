import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseChainAtHeightParams {
  height: string
}

/**
 * Hook for fetching blockchain information at a specific height
 * @param params - Parameters for fetching chain information
 * @param params.height - The blockchain height to fetch information for
 * @returns A query object containing the chain information at the specified height
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useChainAtHeight(params: UseChainAtHeightParams) {
  const { height } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "chainAtHeight", network, height],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getChainAtHeight(height)
    },
  })
}
