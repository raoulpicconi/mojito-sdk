import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { ChangeMetadataUriParams } from "../../index.d"

/**
 * Hook for changing a token's metadata URI
 * @returns A mutation object for changing metadata URI that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useChangeMetadataUri() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: ChangeMetadataUriParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.changeMetadataUri(params)
    },
  })
}
