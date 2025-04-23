import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { LockTokenSupplyParams } from "../../index.d"

/**
 * Hook for locking a token's supply
 * @returns A mutation object for locking token supply that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useLockTokenSupply() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: LockTokenSupplyParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.lockTokenSupply(params)
    },
  })
}
