import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseTransactionParams {
  transactionId: string
}

/**
 * Hook for fetching transaction information
 * @param params - Parameters for fetching the transaction
 * @param params.transactionId - The ID of the transaction to fetch
 * @returns A query object containing the transaction information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useTransaction(params: UseTransactionParams) {
  const { transactionId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "transaction", network, transactionId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getTransaction(transactionId)
    },
  })
}
