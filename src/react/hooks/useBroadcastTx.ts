import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { BroadcastTxParams } from "../../index.d"

export function useBroadcastTx() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: BroadcastTxParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.broadcastTx(params)
    },
  })
}
