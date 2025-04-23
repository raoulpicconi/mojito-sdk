import { useMutation } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { UnmintTokenParams } from "../../index.d"

/**
 * Hook for unminting tokens
 * @returns A mutation object for unminting tokens that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useUnmintToken() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: UnmintTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.unmintToken(params)
    },
  })
}
