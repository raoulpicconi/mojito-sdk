import { useQueries, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { getBTCTransaction } from "../../bitcoin"

export interface UseBTCTransactionsParams {
  transactionIds: string[]
}

// Define the type for the options, excluding queryKey and queryFn
type UseBTCTransactionsOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<typeof getBTCTransaction>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching Bitcoin transactions information
 * @param params - Parameters for fetching the transactions
 * @param params.transactionIds - The IDs of the transactions to fetch
 * @param options - Optional useQuery options
 * @returns A query object containing the transactions information
 */
export function useBTCTransactions(params: UseBTCTransactionsParams, options?: UseBTCTransactionsOptions) {
  const { transactionIds } = params
  const { network } = useNetwork()

  return useQueries({
    queries: transactionIds.map((transactionId) => ({
      queryKey: ["bitcoin", "transaction", network, transactionId],
      queryFn: () => {
        return getBTCTransaction(transactionId, network === "testnet")
      },
      ...options,
    })),
  })
}
