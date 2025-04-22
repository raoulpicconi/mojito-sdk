import { useMutation } from "@tanstack/react-query"
import { useConfig } from "./useConfig"
import { MintlayerAPIClient } from "../../api"

export function useSubmitTransaction() {
  const { apiServer } = useConfig()

  return useMutation({
    mutationFn: (transaction: string) => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.submitTransaction(transaction)
    },
  })
}
