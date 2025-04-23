import { useQueries, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"
import { MintlayerAPIClient } from "../../api"

export interface UseTokensParams {
  tokenIds: string[]
}

// Define the type for the options that can be passed to each individual query
// within useQueries, excluding queryKey and queryFn which are handled internally.
// Assuming the result of apiClient.getToken is consistent for all tokens.
type UseTokensOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getToken"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching multiple token information using useQueries
 * @param params - Parameters for fetching token information
 * @param params.tokenIds - An array of token IDs to fetch
 * @param options - Optional useQuery options to apply to *each* query in the batch
 * @returns An array of query results, one for each tokenId
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useTokens(params: UseTokensParams, options?: UseTokensOptions) {
  const { tokenIds } = params
  const apiClient = useApiClient()
  const { network } = useNetwork()

  return useQueries({
    queries: tokenIds.map((tokenId) => ({
      queryKey: ["mintlayer", "token", network, tokenId],
      queryFn: () => {
        if (!apiClient) throw new MintlayerApiClientNotFoundError()
        return apiClient.getToken(tokenId)
      },
      ...options,
    })),
  })
}
