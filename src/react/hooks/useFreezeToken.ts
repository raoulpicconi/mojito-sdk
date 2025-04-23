import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { FreezeTokenParams } from "../../index.d"

/**
 * Hook for freezing a token
 * @returns A mutation object for freezing tokens that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useFreezeToken() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: FreezeTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.freezeToken(params)
    },
  })
}
