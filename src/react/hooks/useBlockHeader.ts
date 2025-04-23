import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseBlockHeaderParams {
  blockId: string
}

/**
 * Hook for fetching block header information
 * @param params - Parameters for fetching block header
 * @param params.blockId - The ID of the block to fetch the header for
 * @returns A query object containing the block header information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useBlockHeader(params: UseBlockHeaderParams) {
  const { blockId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "blockHeader", network, blockId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getBlockHeader(blockId)
    },
  })
}
