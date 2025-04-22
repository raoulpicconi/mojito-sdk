import { useMutation } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { UnmintTokenParams } from "../../index.d"

export function useUnmintToken() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: UnmintTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.unmintToken(params)
    },
  })
}
