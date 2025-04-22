import { useQuery } from "@tanstack/react-query"
import { MintlayerAPIClient } from "../../api"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"

export interface UseTransactionParams {
  id: string
}

export function useTransaction(params: UseTransactionParams) {
  const { id } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "transaction", network, id],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getTransaction(id)
    },
  })
}
