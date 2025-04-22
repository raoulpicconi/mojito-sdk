import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { ChangeMetadataUriParams } from "../../index.d"

export function useChangeMetadataUri() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: ChangeMetadataUriParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.changeMetadataUri(params)
    },
  })
}
