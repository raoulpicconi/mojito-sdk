import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"
import { MintlayerAPIClient } from "../../api"

export interface UseBlockTransactionIdsParams {
  blockId: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseBlockTransactionIdsOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getBlockTransactionIds"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching the list of transaction IDs in a specific block
 * @param params - Parameters for fetching block transaction IDs
 * @param params.blockId - The ID of the block to fetch transaction IDs for
 * @param options - Optional useQuery options
 * @returns A query object containing the list of transaction IDs in the block
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useBlockTransactionIds(params: UseBlockTransactionIdsParams, options?: UseBlockTransactionIdsOptions) {
  const { blockId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "blockTransactionIds", network, blockId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getBlockTransactionIds(blockId)
    },
    ...options,
  })
}
