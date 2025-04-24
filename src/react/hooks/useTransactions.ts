import { useQueries, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseTransactionsParams {
  transactionIds: string[]
}

// Define the type for the options, excluding queryKey and queryFn
type UseTransactionsOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getTransaction"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching transactions information
 * @param params - Parameters for fetching the transactions
 * @param params.transactionIds - The IDs of the transactions to fetch
 * @param options - Optional useQuery options
 * @returns A query object containing the transactions information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useTransactions(params: UseTransactionsParams, options?: UseTransactionsOptions) {
  const { transactionIds } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQueries({
    queries: transactionIds.map((transactionId) => ({
      queryKey: ["mintlayer", "transaction", network, transactionId],
      queryFn: () => {
        if (!apiClient) throw new MintlayerApiClientNotFoundError()
        return apiClient.getTransaction(transactionId)
      },
      // Spread the additional options
    })),
    ...options,
  })
}
