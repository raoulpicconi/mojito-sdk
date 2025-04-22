import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { LockTokenSupplyParams } from "../../index.d"

export function useLockTokenSupply() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: LockTokenSupplyParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.lockTokenSupply(params)
    },
  })
}
