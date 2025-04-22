import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { BurnParams } from "../../index.d"

export function useBurnToken() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: BurnParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.burn(params)
    },
  })
}
