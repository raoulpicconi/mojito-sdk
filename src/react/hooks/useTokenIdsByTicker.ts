import { useQuery } from "@tanstack/react-query"
import { MintlayerAPIClient } from "../../api"
import { useNetwork } from "./useNetwork"
import { useConfig } from "./useConfig"
import { PaginationParams } from "../../index.d"

export interface UseTokenIdsByTickerParams {
  ticker: string
  pagination?: PaginationParams
}

export function useTokenIdsByTicker(params: UseTokenIdsByTickerParams) {
  const { ticker, pagination } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "tokenIdsByTicker", network, ticker, pagination],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getTokenIdsByTicker(ticker, pagination)
    },
  })
}
