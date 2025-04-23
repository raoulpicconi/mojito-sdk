import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseTokenIdsByTickerParams {
  ticker: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseTokenIdsByTickerOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getTokenIdsByTicker"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching token IDs by their ticker symbol
 * @param params - Parameters for fetching token IDs
 * @param params.ticker - The ticker symbol to search for
 * @param options - Optional useQuery options
 * @returns A query object containing the list of token IDs matching the ticker
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useTokenIdsByTicker(params: UseTokenIdsByTickerParams, options?: UseTokenIdsByTickerOptions) {
  const { ticker } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "tokenIdsByTicker", network, ticker],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getTokenIdsByTicker(ticker)
    },
    // Spread the additional options
    ...options,
  })
}
