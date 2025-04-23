import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseTokenIdsByTickerParams {
  ticker: string
}

export function useTokenIdsByTicker(params: UseTokenIdsByTickerParams) {
  const { ticker } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "tokenIdsByTicker", network, ticker],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getTokenIdsByTicker(ticker)
    },
  })
}
