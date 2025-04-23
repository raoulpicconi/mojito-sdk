import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseTransactionParams {
  transactionId: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseTransactionOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getTransaction"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching transaction information
 * @param params - Parameters for fetching the transaction
 * @param params.transactionId - The ID of the transaction to fetch
 * @param options - Optional useQuery options
 * @returns A query object containing the transaction information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useTransaction(params: UseTransactionParams, options?: UseTransactionOptions) {
  const { transactionId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "transaction", network, transactionId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getTransaction(transactionId)
    },
    // Spread the additional options
    ...options,
  })
}
