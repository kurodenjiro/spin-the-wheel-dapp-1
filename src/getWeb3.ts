import Web3 from 'web3'

export function getWeb3() {
  return new Promise<Web3>((resolve, reject) => {
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if ((window as any).ethereum) {
        const web3 = new Web3((window as any).ethereum)
        try {
          // Request account access if needed
          await (window as any).ethereum.enable()
          // Accounts now exposed
          resolve(web3)
        } catch (error) {
          reject(error)
        }
      }
      // Legacy dapp browsers...
      else if ((window as any).web3) {
        // Use Mist/MetaMask's provider.
        const web3 = (window as any).web3
        console.log("Injected web3 detected.")
        resolve(web3)
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "https://data-seed-prebsc-1-s1.binance.org:8545/"
        )
        const web3 = new Web3(provider)
        console.log("No web3 instance injected, using Local web3.")
        resolve(web3)
      }
    })
  })
}
