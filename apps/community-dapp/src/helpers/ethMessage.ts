import { utils } from 'ethers'
import { recoverTypedMessage, TypedMessage } from 'eth-sig-util'

export const packAndArrayify = (types: string[], msg: any[]) => {
  return utils.arrayify(utils.solidityPack(types, msg))
}

export function recoverAddress(data: TypedMessage<any>, sig: string) {
  return recoverTypedMessage({ data, sig }, 'V3')
}
