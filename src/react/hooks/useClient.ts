import { useContext } from "react"
import { MintlayerContext } from "../context"
import { MintlayerProviderNotFoundError } from "../errors"

export function useClient() {
  const context = useContext(MintlayerContext)
  if (!context) {
    throw new MintlayerProviderNotFoundError()
  }
  return context.client
}
