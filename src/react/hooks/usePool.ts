import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UsePoolParams {
  poolId: string
}

// Define the type for the options, excluding queryKey and queryFn
type UsePoolOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getPool"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching pool information
 * @param params - Parameters for fetching pool information
 * @param params.poolId - The ID of the pool to fetch
 * @param options - Optional useQuery options
 * @returns A query object containing the pool information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function usePool(params: UsePoolParams, options?: UsePoolOptions) {
  const { poolId } = params
  const apiClient = useApiClient()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "pool", network, poolId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getPool(poolId)
    },
    ...options,
  })
}
