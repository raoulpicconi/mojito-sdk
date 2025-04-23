import { useContext } from "react"
import { MintlayerContext } from "../context"
import { MintlayerProviderNotFoundError } from "../errors"

/**
 * Hook for accessing the Mintlayer client instance
 * @returns The Mintlayer client instance
 * @throws {MintlayerProviderNotFoundError} If the MintlayerProvider is not found in the component tree
 */
export function useClient() {
  const context = useContext(MintlayerContext)
  if (!context) {
    throw new MintlayerProviderNotFoundError()
  }
  return context.client
}
