import { useContext } from "react"
import { MintlayerContext } from "../context"
import { MintlayerProviderNotFoundError } from "../errors"

export function useApiClient() {
  const context = useContext(MintlayerContext)
  if (!context) {
    throw new MintlayerProviderNotFoundError()
  }
  return context.apiClient
}
