import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { ChangeTokenAuthorityParams } from "../../index.d"

export function useChangeTokenAuthority() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: ChangeTokenAuthorityParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.changeTokenAuthority(params)
    },
  })
}
