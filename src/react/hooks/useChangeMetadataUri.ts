import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { ChangeMetadataUriParams } from "../../index.d"
import { useNetwork } from "./useNetwork"

/**
 * Hook for changing a token's metadata URI
 * @returns A mutation object for changing metadata URI that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useChangeMetadataUri() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: (params: ChangeMetadataUriParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.changeMetadataUri(params)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "token", network, variables.token_id] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
    },
  })
}
