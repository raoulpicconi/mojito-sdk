import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

// Define the type for the options, excluding queryKey and queryFn
type UsePoolsOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getPools"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching all pools
 * @param options - Optional useQuery options
 * @returns A query object containing the list of all pools
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function usePools(options?: UsePoolsOptions) {
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "pools", network],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getPools()
    },
    // Spread the additional options
    ...options,
  })
}
