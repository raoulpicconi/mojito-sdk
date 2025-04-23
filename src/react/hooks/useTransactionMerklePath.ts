import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"
import { MintlayerAPIClient } from "../../api"

export interface UseTransactionMerklePathParams {
  transactionId: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseTransactionMerklePathOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getTransactionMerklePath"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching the Merkle path of a transaction
 * @param params - Parameters for fetching the transaction Merkle path
 * @param params.transactionId - The ID of the transaction to get the Merkle path for
 * @param options - Optional useQuery options
 * @returns A query object containing the transaction's Merkle path information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useTransactionMerklePath(
  params: UseTransactionMerklePathParams,
  options?: UseTransactionMerklePathOptions,
) {
  const { transactionId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "transactionMerklePath", network, transactionId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getTransactionMerklePath(transactionId)
    },
    ...options,
  })
}
