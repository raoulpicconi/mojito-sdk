import { useQuery } from "@tanstack/react-query"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"
import { MintlayerAPIClient } from "../../api"

export interface UseTransactionMerklePathParams {
  id: string
}

export function useTransactionMerklePath(params: UseTransactionMerklePathParams) {
  const { id } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "transaction", "merkle-path", network, id],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getTransactionMerklePath(id)
    },
  })
}
