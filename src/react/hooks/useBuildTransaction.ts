import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { BuildTransactionParams } from "../../types"

/**
 * Hook for building a new transaction
 * @returns A mutation object for building transactions that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useBuildTransaction() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: BuildTransactionParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.buildTransaction(params)
    },
  })
}
