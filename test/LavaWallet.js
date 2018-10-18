/*

https://medium.com/@adrianmcli/migrating-your-truffle-project-to-web3-v1-0-ed3a56f11a4
*/

const { getWeb3, getContractInstance } = require("./web3helpers")
const web3 = getWeb3()
const getInstance = getContractInstance(web3)


const ethAbi = require('ethereumjs-abi')
var ethUtil =  require('ethereumjs-util');
var web3utils =  require('web3-utils');

const Tx = require('ethereumjs-tx')


var EIP712Helper = require("./EIP712Helper");
var LavaTestUtils = require("./LavaTestUtils");

var lavaTestUtils = new LavaTestUtils();

var test_account= {
    'address': '0x087964cd8b33ea47c01fbe48b70113ce93481e01',
    'privateKey': 'dca672104f895219692175d87b04483d31f53af8caad1d7348d269b35e21c3df'
}



contract("LavaWallet", (accounts) => {

  var walletContract ;
  var tokenContract;
  var kingContract;
  var mintHelperContract;
  var doubleKingsRewardContract;



  it("can deploy ", async function () {
    walletContract = getInstance("LavaWallet")
    tokenContract = getInstance("_0xBitcoinToken")
    kingContract = getInstance("MiningKing")
    mintHelperContract = getInstance("MintHelper")
    doubleKingsRewardContract = getInstance("DoubleKingsReward")





    assert.ok(walletContract);
  })




      it("finds schemahash", async function () {


        //https://github.com/ethereum/EIPs/blob/master/assets/eip-712/Example.js

        const typedData = {
                types: {
                    EIP712Domain: [
                        { name: 'name', type: 'string' },
                        { name: 'verifyingContract', type: 'address' }
                    ],
                    LavaPacket: [
                        { name: 'methodname', type: 'bytes' },  //?
                        { name: 'requireKingRelay', type: 'bool' },
                        { name: 'from', type: 'address' },
                        { name: 'to', type: 'address' },
                        { name: 'wallet', type: 'address' },
                        { name: 'token', type: 'address' },
                        { name: 'tokens', type: 'uint256' },
                        { name: 'relayerReward', type: 'uint256' },
                        { name: 'expires', type: 'uint256' },
                        { name: 'nonce', type: 'uint256' }
                    ],
                },
                primaryType: 'LavaPacket',
                domain: {
                    name: 'Lava Wallet',
                    verifyingContract: walletContract.options.address,
                },
                packet: {   //what is word supposed to be ??
                    methodname: 'anyTransfer',
                    requireKingRelay: false,
                    from: test_account.address,
                    to: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                    wallet: walletContract.options.address,
                    token: tokenContract.options.address,
                    tokens: 0,
                    relayerReward: 0,
                    expires: 999999999,
                    nonce: 0,
                },
            };

            const types = typedData.types;



            // signHash() {
                var typedDataHash = ethUtil.sha3(
                    Buffer.concat([
                        Buffer.from('1901', 'hex'),
                        EIP712Helper.structHash('EIP712Domain', typedData.domain, types),
                        EIP712Helper.structHash(typedData.primaryType, typedData.packet, types),
                    ]),
                );

                const sig = ethUtil.ecsign(typedDataHash , Buffer.from(test_account.privateKey, 'hex') );

                //assert.equal(ethUtil.bufferToHex(typedDataHash), '0xa5b19006c219117816a77e959d656b48f0f21e037fc152224d97a5c016b63692' )
                assert.equal(sig.v,28 )


            });

})
