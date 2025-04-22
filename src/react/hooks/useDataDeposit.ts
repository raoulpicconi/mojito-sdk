import { useMutation } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { DataDepositParams } from "../../index.d"

export function useDataDeposit() {
  const client = useClient()

  return useMutation({
    mutationFn: (data: DataDepositParams) => {
      if (!client) throw new Error("Client not found")
      return client.dataDeposit(data)
    },
  })
}
