import type { NextPage } from 'next'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { formatEther } from 'ethers/lib/utils'
import generateUseDiamond from '../utils/generateUseDiamond'
import diamond from '../diamond.json'

const Home: NextPage = () => {
  const { account, library, activateBrowserWallet } = useEthers()

  const useDiamond = generateUseDiamond(diamond.address, account ? library?.getSigner() as any : undefined)

  const initToken = () => {
    useDiamond.initMyToken.send('SD', 'sd', 8, '0xDEC3e07D46c46C089a323D62E60826D03716d7a2')
  }

  const balance = useDiamond.balanceOf('0xDEC3e07D46c46C089a323D62E60826D03716d7a2')


  const etherBalance = useEtherBalance(account)

  return (
    <div>
      <div>
        <button onClick={() => activateBrowserWallet()}>Connect</button>
      </div>
      {account && <div>
        <>
        Account: {account}<br/>
        Balance: {balance?.toString()}<br />
        {etherBalance && (
        <div className="balance">
          Ether balance:
          <p className="bold">{formatEther(etherBalance)} ETH</p>
        </div>
      )}
        <button onClick={initToken}>init</button>
        </>
      </div>}
    </div>
  )
}

export default Home
