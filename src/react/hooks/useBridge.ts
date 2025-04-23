import { useMutation } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { BridgeParams } from "../../index.d"

/**
 * Hook for performing bridge operations
 * @returns A mutation object for bridge operations that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useBridge() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: BridgeParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.bridgeRequest(params)
    },
  })
}
