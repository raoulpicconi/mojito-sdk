import { useQuery } from "@tanstack/react-query"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"
import { MintlayerAPIClient } from "../../api"
import { PaginationParams } from "../../index.d"

export interface UseOrdersParams {
  pagination?: PaginationParams
}

export function useOrders(params?: UseOrdersParams) {
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "orders", network, params?.pagination],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getOrders(params?.pagination)
    },
  })
}
