import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { BuildTransactionParams } from "../../index.d"

export function useBuildTransaction() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: BuildTransactionParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.buildTransaction(params)
    },
  })
}
