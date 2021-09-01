import { createContext, FC } from 'react'
import { useQuery } from 'react-query'
import Web3 from 'web3'
import { Casino as CasinoType } from './types/casino'
import Casino from './contracts/casino.json'
import { getWeb3 } from './getWeb3'
import { CasinoWheelPage } from './pages/CasinoWheelPage'
import { AbiItem } from 'web3-utils'

export const Web3Context = createContext(undefined as unknown as Web3)
export const AccountContext = createContext(undefined as unknown as string)
export const CasinoContext = createContext(undefined as unknown as CasinoType)

export const App: FC = () => {
  const web3Loader = useQuery('web3', async () => {
    const web3 = await getWeb3()
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]

    
    //const deployedNetwork = Casino.networks[networkId]
    const casino = new web3.eth.Contract(
     
      Casino.abi  as AbiItem[],
      "0x8c3bcb0a7a470984af97aca342b1f3af678d52f9",
    ) as unknown as CasinoType

    return {
      web3,
      account,
      casino,
    }
  })

  if (web3Loader.isLoading) {
    return <div>Loading web3...</div>
  }
  if (!web3Loader.isSuccess) {
    return <div>Error loading web3</div>
  }

  const { web3, account, casino } = web3Loader.data

  if (account == null) {
    return <div>No account connected</div>
  }

  return (
    <Web3Context.Provider value={web3}>
      <AccountContext.Provider value={account}>
        <CasinoContext.Provider value={casino}>
          <CasinoWheelPage />
        </CasinoContext.Provider>
      </AccountContext.Provider>
    </Web3Context.Provider>
  )
}
