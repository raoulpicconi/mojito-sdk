import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { TransferParams } from "../../index.d"

export function useTransfer() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: TransferParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.transfer(params)
    },
  })
}
