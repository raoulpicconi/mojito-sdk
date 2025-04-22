import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { FreezeTokenParams } from "../../index.d"

export function useFreezeToken() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: FreezeTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.freezeToken(params)
    },
  })
}
