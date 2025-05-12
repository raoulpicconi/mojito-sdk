import { useQueries, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseNFTsParams {
  nftIds: string[]
}

// Define the type for the options, excluding queryKey and queryFn
type UseNFTsOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getNFT"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching NFT information
 * @param params - Parameters for fetching NFTs information
 * @param params.nftIds - The IDs of the NFTs to fetch
 * @param options - Optional useQuery options
 * @returns A query object containing the NFTs information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useNFTs(params: UseNFTsParams, options?: UseNFTsOptions) {
  const { nftIds } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQueries({
    queries: nftIds.map((nftId) => ({
      queryKey: ["mintlayer", "nft", network, nftId],
      queryFn: () => {
        if (!apiClient) throw new MintlayerApiClientNotFoundError()
        return apiClient.getNFT(nftId)
      },
      ...options,
    })),
  })
}
