import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { ChangeTokenAuthorityParams } from "../../index.d"

/**
 * Hook for changing a token's authority
 * @returns A mutation object for changing token authority that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useChangeTokenAuthority() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: ChangeTokenAuthorityParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.changeTokenAuthority(params)
    },
  })
}
