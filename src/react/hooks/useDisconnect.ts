import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"

/**
 * Hook for disconnecting the current account
 * @returns A mutation object for disconnecting the account that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useDisconnect() {
  const client = useClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.disconnect()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "account"] })
    },
  })
}
