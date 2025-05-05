import { UseMutationResult, useMutation } from "@tanstack/react-query"
import { Client } from "@mintlayer/sdk"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { SignTransactionParams } from "../../types"

// Extract the return type of signTransaction
type SignTransactionReturn = Awaited<ReturnType<Client["signTransaction"]>>

/**
 * Hook for signing a transaction
 * @returns A mutation object for signing transactions that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useSignTransaction(): UseMutationResult<SignTransactionReturn, Error, SignTransactionParams> {
  const client = useClient()

  return useMutation<SignTransactionReturn, Error, SignTransactionParams>({
    mutationFn: (params: SignTransactionParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.signTransaction(params)
    },
  })
}
