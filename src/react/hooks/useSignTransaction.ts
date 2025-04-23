import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { SignTransactionParams } from "../../index.d"

/**
 * Hook for signing a transaction
 * @returns A mutation object for signing transactions that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useSignTransaction() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: SignTransactionParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.signTransaction(params)
    },
  })
}
