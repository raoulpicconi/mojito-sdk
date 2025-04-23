import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseBlockRewardParams {
  blockId: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseBlockRewardOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getBlockReward"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching the reward information for a specific block
 * @param params - Parameters for fetching block reward
 * @param params.blockId - The ID of the block to fetch reward for
 * @param options - Optional useQuery options
 * @returns A query object containing the block reward information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useBlockReward(params: UseBlockRewardParams, options?: UseBlockRewardOptions) {
  const { blockId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "blockReward", network, blockId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getBlockReward(blockId)
    },
    // Spread the additional options
    ...options,
  })
}
