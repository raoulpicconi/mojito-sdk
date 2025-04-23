import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseTokenParams {
  tokenId: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseTokenOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getToken"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching token information
 * @param params - Parameters for fetching token information
 * @param params.tokenId - The ID of the token to fetch
 * @param options - Optional useQuery options
 * @returns A query object containing the token information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useToken(params: UseTokenParams, options?: UseTokenOptions) {
  const { tokenId } = params
  const apiClient = useApiClient()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "token", network, tokenId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getToken(tokenId)
    },
    // Spread the additional options
    ...options,
  })
}
