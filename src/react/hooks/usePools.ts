import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

/**
 * Hook for fetching all pools
 * @returns A query object containing the list of all pools
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function usePools() {
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "pools", network],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getPools()
    },
  })
}
