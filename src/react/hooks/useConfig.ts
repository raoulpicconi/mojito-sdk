import { useContext } from "react"
import { MintlayerContext } from "../context"

export function useConfig() {
  const context = useContext(MintlayerContext)
  if (!context) {
    throw new Error("useConfig must be used within a MintlayerProvider")
  }
  return context.state
}
