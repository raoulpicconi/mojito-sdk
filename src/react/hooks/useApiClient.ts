import { useContext } from "react"
import { MintlayerContext } from "../context"
import { MintlayerProviderNotFoundError } from "../errors"

/**
 * Hook for accessing the Mintlayer API client
 * @returns The Mintlayer API client instance
 * @throws {MintlayerProviderNotFoundError} If the Mintlayer provider is not found in the component tree
 */
export function useApiClient() {
  const context = useContext(MintlayerContext)
  if (!context) {
    throw new MintlayerProviderNotFoundError()
  }
  return context.apiClient
}
