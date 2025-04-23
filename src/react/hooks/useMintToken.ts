import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { MintTokenParams } from "../../index.d"

/**
 * Hook for minting new tokens
 * @returns A mutation object for minting tokens that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useMintToken() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: MintTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.mintToken(params)
    },
  })
}
