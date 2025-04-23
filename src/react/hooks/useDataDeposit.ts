import { useMutation } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { DataDepositParams } from "../../index.d"
import { MintlayerClientNotFoundError } from "../errors"

/**
 * Hook for performing data deposit operations
 * @returns A mutation object for data deposit operations that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useDataDeposit() {
  const client = useClient()

  return useMutation({
    mutationFn: (data: DataDepositParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.dataDeposit(data)
    },
  })
}
