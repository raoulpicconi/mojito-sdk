import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { SignTransactionParams } from "../../index.d"

export function useSignTransaction() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: SignTransactionParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.signTransaction(params)
    },
  })
}
