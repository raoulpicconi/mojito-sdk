import { useMutation } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

/**
 * Hook for submitting a transaction to the network
 * @returns A mutation object for submitting transactions that can be used with React Query
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useSubmitTransaction() {
  const apiClient = useApiClient()

  return useMutation({
    mutationFn: (transaction: string) => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.submitTransaction(transaction)
    },
  })
}
