import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseBlockParams {
  blockId: string
}

/**
 * Hook for fetching block information
 * @param params - Parameters for fetching block information
 * @param params.blockId - The ID of the block to fetch
 * @returns A query object containing the block information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useBlock(params: UseBlockParams) {
  const { blockId } = params
  const apiClient = useApiClient()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "block", network, blockId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getBlock(blockId)
    },
  })
}
