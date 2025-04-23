import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseTokenParams {
  tokenId: string
}

/**
 * Hook for fetching token information
 * @param params - Parameters for fetching token information
 * @param params.tokenId - The ID of the token to fetch
 * @returns A query object containing the token information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useToken(params: UseTokenParams) {
  const { tokenId } = params
  const apiClient = useApiClient()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "token", network, tokenId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getToken(tokenId)
    },
  })
}
