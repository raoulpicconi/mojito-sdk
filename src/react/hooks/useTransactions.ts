import { useQuery } from "@tanstack/react-query"
import { MintlayerAPIClient } from "../../api"
import { PaginationParams } from "../../index.d"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"

export interface UseTransactionsParams {
  pagination?: PaginationParams
}

export function useTransactions(params: UseTransactionsParams) {
  const { pagination } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "transactions", network, pagination],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getTransactions(pagination)
    },
  })
}
