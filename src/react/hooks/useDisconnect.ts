import { useMutation } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"

export function useDisconnect() {
  const client = useClient()

  return useMutation({
    mutationFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.disconnect()
    },
  })
}
