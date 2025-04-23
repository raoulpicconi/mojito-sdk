import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseBlockParams {
  blockId: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseBlockOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getBlock"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching block information
 * @param params - Parameters for fetching block information
 * @param params.blockId - The ID of the block to fetch
 * @param options - Optional useQuery options
 * @returns A query object containing the block information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useBlock(params: UseBlockParams, options?: UseBlockOptions) {
  const { blockId } = params
  const apiClient = useApiClient()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "block", network, blockId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getBlock(blockId)
    },
    // Spread the additional options
    ...options,
  })
}
