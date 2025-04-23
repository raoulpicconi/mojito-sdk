import { useMutation } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export function useSubmitTransaction() {
  const apiClient = useApiClient()

  return useMutation({
    mutationFn: (transaction: string) => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.submitTransaction(transaction)
    },
  })
}
