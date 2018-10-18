const { getWeb3, getContractInstance } = require("./web3helpers")
const web3 = getWeb3()
const getInstance = getContractInstance(web3)

contract("LavaWallet", (accounts) => {
  it("can deploy ", async function () {
    const wallet = getInstance("LavaWallet")
    assert.ok(wallet);
  })


})
