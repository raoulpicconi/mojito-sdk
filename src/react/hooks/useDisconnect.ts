import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerProviderNotFoundError } from "../errors"
import { useContext } from "react"
import { MintlayerContext } from "../context"

/**
 * Hook for disconnecting the current account
 * @returns A mutation object for disconnecting the account that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useDisconnect() {
  const queryClient = useQueryClient()
  const context = useContext(MintlayerContext)

  if (!context) {
    throw new MintlayerProviderNotFoundError()
  }

  const { storageService, storageKeys } = context

  return useMutation({
    mutationFn: () => {
      storageService.setItem(storageKeys.connectionState, "disconnected")

      // FIXME: This is a hack to ensure the connection state is updated, to be removed once disconnect is implemented
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 100)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "account"] })
    },
  })
}
