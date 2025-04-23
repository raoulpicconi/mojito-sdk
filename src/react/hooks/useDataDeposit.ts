import { useMutation } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { DataDepositParams } from "../../index.d"
import { MintlayerClientNotFoundError } from "../errors"

export function useDataDeposit() {
  const client = useClient()

  return useMutation({
    mutationFn: (data: DataDepositParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.dataDeposit(data)
    },
  })
}
