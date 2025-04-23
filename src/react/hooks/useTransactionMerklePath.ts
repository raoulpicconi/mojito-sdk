import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseTransactionMerklePathParams {
  transactionId: string
}

/**
 * Hook for fetching the Merkle path of a transaction
 * @param params - Parameters for fetching the transaction Merkle path
 * @param params.transactionId - The ID of the transaction to get the Merkle path for
 * @returns A query object containing the transaction's Merkle path information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useTransactionMerklePath(params: UseTransactionMerklePathParams) {
  const { transactionId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "transactionMerklePath", network, transactionId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getTransactionMerklePath(transactionId)
    },
  })
}
