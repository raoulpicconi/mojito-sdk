import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { TransferParams } from "../../index.d"

/**
 * Hook for performing token transfers
 * @returns A mutation object for transfer operations that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useTransfer() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: TransferParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.transfer(params)
    },
  })
}
