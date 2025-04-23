import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

/**
 * Hook for fetching the current network fee rate
 * @returns A query object containing the current network fee rate
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useFeerate() {
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "feerate", network],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getFeerate()
    },
  })
}
