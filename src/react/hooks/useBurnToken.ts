import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { BurnParams } from "../../index.d"

/**
 * Hook for burning tokens
 * @returns A mutation object for burning tokens that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useBurnToken() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: BurnParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.burn(params)
    },
  })
}
