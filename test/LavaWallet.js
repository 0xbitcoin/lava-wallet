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


            it("checks sub hashes  ", async function () {

              var domainTypehash = await walletContract.methods.getDomainTypehash().call()
              var lavaPacketTypehash = await walletContract.methods.getLavaPacketTypehash().call()




              assert.equal(domainTypehash, '0xee552a4f357a6d8ecee15fed74927d873616e6da31fd672327acf0916acc174a'   ); //initialized

              assert.equal(lavaPacketTypehash, '0x7547230e904ff79a2bdc45587f15a93dffcddb853fdd4cc76c72e01ca596df73'   ); //initialized


              var methodname = web3utils.fromAscii(  'approve' )  //convert to bytes
              var relayMode = 'any'
              var from= test_account.address
              var to= "0x357FfaDBdBEe756aA686Ef6843DA359E2a85229c"
              var walletAddress=walletContract.options.address
              var tokenAddress=tokenContract.options.address
              var tokenAmount=2000000
              var relayerReward=1000000
              var expires=336504400
              var nonce='0xc18f687c56f1b2749af7d6151fa351'
              //var expectedSignature="0x8ef27391a81f77244bf95df58737eecac386ab9a47acd21bdb63757adf71ddf878169c18e4ab7b71d60f333c870258a0644ac7ade789d59c53b0ab75dbcc87d11b"

               //add new code here !!

              var typedData = lavaTestUtils.getLavaTypedDataFromParams(
                methodname,
                relayMode,
                from,
                to,
                walletAddress,
                tokenAddress,
                tokenAmount,
                relayerReward,
                expires,
                nonce);


              var domainStructHash =  EIP712Helper.typeHash('EIP712Domain', typedData.types);
              var lavaPacketStructHash =  EIP712Helper.typeHash('LavaPacket', typedData.types);

              assert.equal('0x' + domainStructHash.toString('hex'), '0xee552a4f357a6d8ecee15fed74927d873616e6da31fd672327acf0916acc174a'   ); //initialized

               assert.equal('0x' + lavaPacketStructHash.toString('hex'), '0x7547230e904ff79a2bdc45587f15a93dffcddb853fdd4cc76c72e01ca596df73'   ); //initialized


            });








            it("can approveTokensWithSignature ", async function () {


                await printBalance(test_account.address,tokenContract)




                var addressFrom = test_account.address;

                console.log( addressFrom )

                //var msg = '0x8CbaC5e4d803bE2A3A5cd3DbE7174504c6DD0c1C'
                var requestRecipient = test_account.address;
                var requestQuantity = 500;



                 var requestNonce = web3utils.randomHex(32);

                 var privateKey = test_account.privateKey;


                 var methodName = web3utils.fromAscii(  'approve' )  //convert to bytes
                 var relayMethod = 'any'
                 var from= addressFrom
                 var to= "0x357FfaDBdBEe756aA686Ef6843DA359E2a85229c"
                 var walletAddress=walletContract.options.address
                 var tokenAddress=tokenContract.options.address
                 var tokenAmount=2000000
                 var relayerReward=1000000
                 var expires=336504400
                 var nonce='0xc18f687c56f1b2749af7d6151fa351'
                 //var expectedSignature="0x8ef27391a81f77244bf95df58737eecac386ab9a47acd21bdb63757adf71ddf878169c18e4ab7b71d60f333c870258a0644ac7ade789d59c53b0ab75dbcc87d11b"

                  //add new code here !!

                 var typedData = lavaTestUtils.getLavaTypedDataFromParams(
                   methodName,
                   relayMethod,
                   from,
                   to,
                   walletAddress,
                   tokenAddress,
                   tokenAmount,
                   relayerReward,
                   expires,
                   nonce);


                    const types = typedData.types;


                const typedDataHash = lavaTestUtils.getLavaTypedDataHash(typedData,types);


                  //https://github.com/ethers-io/ethers.js/issues/46/




                  var tuple = [
                  methodName,
                  relayMethod,
                  from,
                  to,
                  walletAddress,
                  tokenAddress,
                  tokenAmount,
                  relayerReward,
                  expires,
                  nonce];

                    console.log('  tuple   ',   tuple  )



                ///msg hash signed is 0x9201073a01df85b87dab83ad2498bf5b2190bf62cb03b2a407ba7d77279a4ceb
                var lavaMsgHash = await walletContract.methods.getLavaTypedDataHash(  tuple ).call({from: test_account.address})
                console.log('lavaMsgHash',lavaMsgHash)

                assert.equal(lavaMsgHash, '0x' + typedDataHash.toString('hex') ); //initialized




                  var lavaPacketStruct =   typedData.packet

                  var privKey = Buffer.from(privateKey, 'hex')

                const sig = ethUtil.ecsign(typedDataHash , privKey );


                console.log('@@ walletContract',  walletContract.options.address)



                  });

})




async function getBalance (account ,tokenContract)
{
      var balance_eth = await (web3.eth.getBalance(account ));
     var balance_token = await tokenContract.methods.balanceOf(account).call({from: account });

     return {ether: web3utils.fromWei(balance_eth.toString(), 'ether'), token: balance_token  };

 }

 async function printBalance (account ,tokenContract)
 {
       var balance_eth = await (web3.eth.getBalance(account ));
      var balance_token = await tokenContract.methods.balanceOf(account).call( {from: account });


      console.log('acct balance', account, web3utils.fromWei(balance_eth.toString() , 'ether')  , balance_token )

  }
