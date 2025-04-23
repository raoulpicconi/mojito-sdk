import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

// Define the type for the options, excluding queryKey and queryFn
type UseTokenIdsOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getTokenIds"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching all token IDs
 * @param options - Optional useQuery options
 * @returns A query object containing the list of all token IDs
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useTokenIds(options?: UseTokenIdsOptions) {
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "tokenIds", network],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getTokenIds()
    },
    // Spread the additional options
    ...options,
  })
}
