import { useMutation } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { BridgeParams } from "../../index.d"

export function useBridge() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: BridgeParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.bridgeRequest(params)
    },
  })
}
