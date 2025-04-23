import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { UnfreezeTokenParams } from "../../index.d"

/**
 * Hook for unfreezing a frozen token
 * @returns A mutation object for unfreezing tokens that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useUnfreezeToken() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: UnfreezeTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.unfreezeToken(params)
    },
  })
}
