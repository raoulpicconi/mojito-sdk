import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

/**
 * Hook for fetching the genesis block information
 * @returns A query object containing the genesis block information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useChainGenesis() {
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "chainGenesis", network],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getChainGenesis()
    },
  })
}
