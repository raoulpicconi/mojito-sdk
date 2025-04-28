import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { useContext } from "react"
import { MintlayerContext } from "../context"

/**
 * Hook for disconnecting the current account
 * @returns A mutation object for disconnecting the account that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useDisconnect() {
  const client = useClient()
  const queryClient = useQueryClient()
  const setConnectionState = useContext(MintlayerContext)?.setConnectionState

  return useMutation({
    mutationFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      setConnectionState?.("disconnected")
      return client.disconnect()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "account"] })
    },
  })
}
