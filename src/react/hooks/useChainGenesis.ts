import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

// Define the type for the options, excluding queryKey and queryFn
type UseChainGenesisOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getChainGenesis"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching the genesis block information
 * @param options - Optional useQuery options
 * @returns A query object containing the genesis block information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useChainGenesis(options?: UseChainGenesisOptions) {
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "chainGenesis", network],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getChainGenesis()
    },
    // Spread the additional options
    ...options,
  })
}
