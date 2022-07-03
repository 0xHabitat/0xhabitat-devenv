import type { NextPage } from 'next'
import { useEthers } from '@usedapp/core'
import generateUseDiamond from '../utils/generateUseDiamond'
import diamond from '../diamond.json'

const Home: NextPage = () => {
  const { account, library, activateBrowserWallet } = useEthers()

  const useDiamond = generateUseDiamond(
    diamond.address,
    account ? (library?.getSigner() as any) : undefined
  )

  // For read functions
  const balance = useDiamond.balanceOf(
    '0xDEC3e07D46c46C089a323D62E60826D03716d7a2'
  )

  // For write functions
  const { state: stateInit } = useDiamond.initMyToken
  const initToken = () => {
    useDiamond.initMyToken.send(
      'SD',
      'sd',
      8,
      '0xDEC3e07D46c46C089a323D62E60826D03716d7a2'
    )
  }

  const { state: stateTransfer } = useDiamond.transfer
  const transfer = () => {
    useDiamond.transfer.send('0xF64D868cfDb1Ad4C3589452Ac541CB851e2E80e4', 10)
  }

  return (
    <div>
      <div>
        <button onClick={() => activateBrowserWallet()}>Connect</button>
      </div>
      {account && (
        <div>
          <>
            Account: {account}
            <br />
            Balance: {balance?.toString()}
            <br />
            <button onClick={initToken}>init</button>
            {(
              {
                PendingSignature: <>wait</>,
                Exception: <>already initialized</>,
              } as any
            )[stateInit.status] || <></>}
            <button onClick={transfer}>transfer</button>
            {(
              {
                PendingSignature: <>wait</>,
                Exception: <>error</>,
              } as any
            )[stateTransfer.status] || <></>}
          </>
        </div>
      )}
    </div>
  )
}

export default Home
