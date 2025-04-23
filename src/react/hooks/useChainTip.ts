import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

// Define the type for the options, excluding queryKey and queryFn
type UseChainTipOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getChainTip"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching the current tip of the blockchain
 * @param options - Optional useQuery options
 * @returns A query object containing the current chain tip information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useChainTip(options?: UseChainTipOptions) {
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "chainTip", network],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getChainTip()
    },
    // Spread the additional options
    ...options,
  })
}
