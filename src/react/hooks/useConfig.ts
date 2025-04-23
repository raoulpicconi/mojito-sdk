import { useContext } from "react"
import { MintlayerContext } from "../context"
import { MintlayerProviderNotFoundError } from "../errors"

/**
 * Hook for accessing the Mintlayer configuration state
 * @returns The current Mintlayer configuration state
 * @throws {MintlayerProviderNotFoundError} If the Mintlayer provider is not found in the component tree
 */
export function useConfig() {
  const context = useContext(MintlayerContext)
  if (!context) {
    throw new MintlayerProviderNotFoundError()
  }
  return context.state
}
