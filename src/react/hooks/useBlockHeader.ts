import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"
import { MintlayerAPIClient } from "../../api"

export interface UseBlockHeaderParams {
  blockId: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseBlockHeaderOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getBlockHeader"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching block header information
 * @param params - Parameters for fetching block header
 * @param params.blockId - The ID of the block to fetch the header for
 * @param options - Optional useQuery options
 * @returns A query object containing the block header information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useBlockHeader(params: UseBlockHeaderParams, options?: UseBlockHeaderOptions) {
  const { blockId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "blockHeader", network, blockId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getBlockHeader(blockId)
    },
    // Spread the additional options
    ...options,
  })
}
