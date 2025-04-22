import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { MintTokenParams } from "../../index.d"

export function useMintToken() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: MintTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.mintToken(params)
    },
  })
}
