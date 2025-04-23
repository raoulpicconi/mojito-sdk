import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseNFTParams {
  nftId: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseNFTOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getNFT"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching NFT information
 * @param params - Parameters for fetching NFT information
 * @param params.nftId - The ID of the NFT to fetch
 * @param options - Optional useQuery options
 * @returns A query object containing the NFT information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useNFT(params: UseNFTParams, options?: UseNFTOptions) {
  const { nftId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "nft", network, nftId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getNFT(nftId)
    },
    // Spread the additional options
    ...options,
  })
}
