import { useQuery } from "@tanstack/react-query"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"
import { MintlayerAPIClient } from "../../api"
import { PaginationParams } from "../../index.d"

export interface UsePoolsParams {
  pagination?: PaginationParams
  sort?: "by_height" | "by_pledge"
}

export function usePools(params?: UsePoolsParams) {
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "pools", network, params],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getPools(params)
    },
  })
}
