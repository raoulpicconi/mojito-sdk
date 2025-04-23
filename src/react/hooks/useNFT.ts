import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseNFTParams {
  nftId: string
}

/**
 * Hook for fetching NFT information
 * @param params - Parameters for fetching NFT information
 * @param params.nftId - The ID of the NFT to fetch
 * @returns A query object containing the NFT information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useNFT(params: UseNFTParams) {
  const { nftId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "nft", network, nftId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getNFT(nftId)
    },
  })
}
