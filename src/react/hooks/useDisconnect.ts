import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError, MintlayerProviderNotFoundError } from "../errors"
import { useContext } from "react"
import { MintlayerContext } from "../context"
import { useClient } from "./useClient"

/**
 * Hook for disconnecting the current account
 * @returns A mutation object for disconnecting the account that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useDisconnect() {
  const client = useClient()
  const queryClient = useQueryClient()
  const context = useContext(MintlayerContext)

  if (!context) {
    throw new MintlayerProviderNotFoundError()
  }

  const { storageService, storageKeys, setAddresses, setAddressesByChain } = context

  return useMutation({
    mutationFn: () => {
      storageService.setItem(storageKeys.connectionState, "disconnected")
      setAddresses({
        mainnet: { receiving: [], change: [] },
        testnet: { receiving: [], change: [] },
      })

      setAddressesByChain({
        bitcoin: { receiving: [], change: [], publicKeys: { receiving: [], change: [] } },
        mintlayer: { receiving: [], change: [], publicKeys: { receiving: [], change: [] } },
      })

      if (!client) throw new MintlayerClientNotFoundError()

      return client.disconnect()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "account"] })
    },
  })
}
