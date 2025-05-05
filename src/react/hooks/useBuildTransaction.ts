import { UseMutationResult, useMutation } from "@tanstack/react-query"
import { Client } from "@mintlayer/sdk"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { BuildTransactionParams } from "../../types"

// Extract the return type of buildTransaction
type BuildTransactionReturn = Awaited<ReturnType<Client["buildTransaction"]>>

/**
 * Hook for building a new transaction
 * @returns A mutation object for building transactions that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useBuildTransaction(): UseMutationResult<BuildTransactionReturn, Error, BuildTransactionParams> {
  const client = useClient()

  return useMutation<BuildTransactionReturn, Error, BuildTransactionParams>({
    mutationFn: (params: BuildTransactionParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.buildTransaction(params)
    },
  })
}
