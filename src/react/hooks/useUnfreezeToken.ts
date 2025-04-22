import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { UnfreezeTokenParams } from "../../index.d"

export function useUnfreezeToken() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: UnfreezeTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.unfreezeToken(params)
    },
  })
}
