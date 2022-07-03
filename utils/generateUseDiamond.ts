import { useCall, useContractFunction } from '@usedapp/core'
import { ContractMethodNames } from '@usedapp/core/dist/esm/src/model/types'
import { Signer } from 'ethers'
import { MyToken__factory } from '../types/ethers-contracts'

interface IFactories {
  [key: ContractMethodNames<any>]: any
}

interface IUseDiamond {
  [key: string]: any
}

const factories: IFactories = {
  MyToken: MyToken__factory,
}

const generateUseDiamond = (address: string, signer: Signer) => {
  let useDiamond: IUseDiamond = {}
  Object.keys(factories).forEach((Name) => {
    const factory = factories[Name]
    const Interface = factory.createInterface()

    let abi = factory.abi
    Object.keys(Interface.functions).forEach((fn) => {
      let functionName = fn.split('(')[0]
      let fnABI = abi.find((a: any) => a.name === functionName)
      if (fnABI?.stateMutability === 'view') {
        useDiamond[functionName] = function (): any {
          const contract = factory.connect(address, signer)
          const { value, error } =
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useCall({
              contract: contract,
              method: functionName,
              args: [...(arguments as any)],
            }) ?? {}
          return value
        }
      } else {
        useDiamond[functionName] = useContractFunction(
          MyToken__factory.connect(address, signer),
          functionName as any
        )
      }
    })
  })
  return useDiamond
}

export default generateUseDiamond
