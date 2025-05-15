import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError, MintlayerProviderNotFoundError } from "../errors"
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
  const context = useContext(MintlayerContext)

  if (!context) {
    throw new MintlayerProviderNotFoundError()
  }

  const { storageService, storageKeys, setAddresses } = context

  return useMutation({
    mutationFn: async () => {
      if (!client) throw new MintlayerClientNotFoundError()
      storageService.setItem(storageKeys.connectionState, "connected")
      const addresses = await client.connect()
      setAddresses(addresses as any)
      return addresses
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "account"] })
    },
  })
}
