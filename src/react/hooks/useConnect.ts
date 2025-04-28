import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { CheckConnectionResponse } from "../../types"
import { MintlayerContext } from "../context"
import { useContext } from "react"

/**
 * Hook for connecting to the Mintlayer network
 * @returns A mutation object for connecting to the network that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useConnect() {
  const client = useClient()
  const queryClient = useQueryClient()
  const setConnectionState = useContext(MintlayerContext)?.setConnectionState

  return useMutation({
    mutationFn: async () => {
      if (!client) throw new MintlayerClientNotFoundError()
      const res = await client.request<CheckConnectionResponse>({ method: "checkConnection" })

      if (!res.isConnected) {
        setConnectionState?.("connected")
        client.connect()
      }

      // FIXME: This is a hack to ensure the connection state is updated, to be removed once connect is fixed
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 1000)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "account"] })
    },
  })
}
