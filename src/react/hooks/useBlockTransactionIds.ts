import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseBlockTransactionIdsParams {
  blockId: string
}

/**
 * Hook for fetching the list of transaction IDs in a specific block
 * @param params - Parameters for fetching block transaction IDs
 * @param params.blockId - The ID of the block to fetch transaction IDs for
 * @returns A query object containing the list of transaction IDs in the block
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useBlockTransactionIds(params: UseBlockTransactionIdsParams) {
  const { blockId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "blockTransactionIds", network, blockId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getBlockTransactionIds(blockId)
    },
  })
}
