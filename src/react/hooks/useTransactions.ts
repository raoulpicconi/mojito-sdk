import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

/**
 * Hook for fetching all transactions
 * @returns A query object containing the list of all transactions
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useTransactions() {
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "transactions", network],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getTransactions()
    },
  })
}
