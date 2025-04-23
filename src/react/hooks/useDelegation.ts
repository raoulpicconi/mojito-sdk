import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseDelegationParams {
  delegationId: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseDelegationOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getDelegation"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching delegation information
 * @param params - Parameters for fetching delegation
 * @param params.delegationId - The ID of the delegation to fetch
 * @param options - Optional useQuery options
 * @returns A query object containing the delegation data
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useDelegation(params: UseDelegationParams, options?: UseDelegationOptions) {
  const { delegationId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "delegation", network, delegationId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getDelegation(delegationId)
    },
    // Spread the additional options
    ...options,
  })
}
