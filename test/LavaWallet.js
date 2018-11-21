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
  //var kingContract;
  var mintHelperContract;
//  var doubleKingsRewardContract;
    var MiningDelegate;


  it("can deploy ", async function () {
    walletContract = getInstance("LavaWallet")
    tokenContract = getInstance("_0xBitcoinToken")
  //  kingContract = getInstance("MiningKing")
    mintHelperContract = getInstance("MintHelper")
    miningDelegateContract = getInstance("MiningDelegate")
  //  doubleKingsRewardContract = getInstance("DoubleKingsReward")





    assert.ok(walletContract);
  })




      it("finds schemahash", async function () {


        //https://github.com/ethereum/EIPs/blob/master/assets/eip-712/Example.js

        const typedData = {
                types: {

                    LavaPacket: [
                        { name: 'methodName', type: 'string' },
                        { name: 'relayAuthority', type: 'address' },
                        { name: 'from', type: 'address' },
                        { name: 'to', type: 'address' },
                        { name: 'wallet', type: 'address' },
                        { name: 'token', type: 'address' },
                        { name: 'tokens', type: 'uint256' },
                        { name: 'relayerRewardToken', type: 'address' },
                        { name: 'relayerRewardTokens', type: 'uint256' },
                        { name: 'expires', type: 'uint256' },
                        { name: 'nonce', type: 'uint256' },
                        { name: 'callData', type: 'bytes' }
                    ],
                },
                primaryType: 'LavaPacket',
                domain: {
                    name: 'Lava Wallet',
                    verifyingContract: walletContract.options.address,
                },
                packet: {   //what is word supposed to be ??
                    methodName: 'approve',
                    relayAuthority:miningDelegateContract.options.address,
                    from: test_account.address,
                    to: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                    wallet: walletContract.options.address,
                    token: tokenContract.options.address,
                    tokens: 0,
                    relayerRewardToken:tokenContract.options.address,
                    relayerRewardTokens: 0,
                    expires: 999999999,
                    nonce: 0,
                    callData: web3utils.asciiToHex('')
                },
            };

            const types = typedData.types;



            // signHash() {
                var typedDataHash = ethUtil.sha3(
                    Buffer.concat([
                        Buffer.from('1901', 'hex'),
                    //    EIP712Helper.structHash('EIP712Domain', typedData.domain, types),
                        EIP712Helper.structHash(typedData.primaryType, typedData.packet, types),
                    ]),
                );

                const sig = ethUtil.ecsign(typedDataHash , Buffer.from(test_account.privateKey, 'hex') );

                //assert.equal(ethUtil.bufferToHex(typedDataHash), '0xa5b19006c219117816a77e959d656b48f0f21e037fc152224d97a5c016b63692' )
                assert.equal(sig.v,28 )


            });


            it("checks sub hashes  ", async function () {

          //    var domainTypehash = await walletContract.methods.getDomainTypehash().call()
              var lavaPacketTypehash = await walletContract.methods.getLavaPacketTypehash().call()




              var methodName =  'approve'    //convert to bytes
              var relayAuthority = miningDelegateContract.options.address
              var from= test_account.address
              var to= "0x357FfaDBdBEe756aA686Ef6843DA359E2a85229c"
              var walletAddress=walletContract.options.address
              var tokenAddress=tokenContract.options.address
              var tokenAmount=2000000
              var relayerRewardToken=tokenContract.options.address
              var relayerRewardTokens=1000000
              var expires=336504400
              var nonce='0xc18f687c56f1b2749af7d6151fa351'
              //var expectedSignature="0x8ef27391a81f77244bf95df58737eecac386ab9a47acd21bdb63757adf71ddf878169c18e4ab7b71d60f333c870258a0644ac7ade789d59c53b0ab75dbcc87d11b"

               //add new code here !!

              var typedData = lavaTestUtils.getLavaTypedDataFromParams(
                methodName,
                relayAuthority,
                from,
                to,
                walletAddress,
                tokenAddress,
                tokenAmount,
                relayerRewardToken,
                relayerRewardTokens,
                expires,
                nonce);


          //    var domainStructHash =  EIP712Helper.typeHash('EIP712Domain', typedData.types);
              var lavaPacketStructHash =  EIP712Helper.typeHash('LavaPacket', typedData.types);

        //      assert.equal(LavaTestUtils.bufferToHex(domainStructHash), domainTypehash    ); //initialized

               assert.equal(LavaTestUtils.bufferToHex(lavaPacketStructHash), lavaPacketTypehash  ); //initialized



               var lavaPacketTuple = [methodName,
                                       relayAuthority,
                                       from,
                                       to,
                                       walletAddress,
                                       tokenAddress,
                                       tokenAmount,
                                       relayerRewardToken,
                                       relayerRewardTokens,
                                       expires,
                                       nonce]

                console.log('lavaPacketTypehash ', lavaPacketTypehash)


              console.log('lava packet tuple ', lavaPacketTuple)


          //     var domainHash = await walletContract.methods.getDomainHash(["Lava Wallet",walletContract.options.address]).call()
               var lavaPacketHash = await walletContract.methods.getLavaPacketHash(lavaPacketTuple).call()



           //assert.equal(domainHash, LavaTestUtils.bufferToHex( EIP712Helper.structHash('EIP712Domain', typedData.domain, typedData.types) )    );


           //why is this failing on the values !?
           assert.equal(lavaPacketHash, LavaTestUtils.bufferToHex( EIP712Helper.structHash('LavaPacket', typedData.packet, typedData.types) )     );



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


                 var methodName =   'approve'    //convert to bytes
                 var relayAuthority = miningDelegateContract.options.address
                 var from= addressFrom
                 var to= "0x357FfaDBdBEe756aA686Ef6843DA359E2a85229c"
                 var walletAddress=walletContract.options.address
                 var tokenAddress=tokenContract.options.address
                 var tokenAmount=2000000
                 var relayerRewardToken=tokenContract.options.address
                 var relayerRewardTokens=1000000
                 var expires=336504400
                 var nonce='0xc18f687c56f1b2749af7d6151fa351'
                 //var expectedSignature="0x8ef27391a81f77244bf95df58737eecac386ab9a47acd21bdb63757adf71ddf878169c18e4ab7b71d60f333c870258a0644ac7ade789d59c53b0ab75dbcc87d11b"

                  //add new code here !!

                 var typedData = lavaTestUtils.getLavaTypedDataFromParams(
                   methodName,
                   relayAuthority,
                   from,
                   to,
                   walletAddress,
                   tokenAddress,
                   tokenAmount,
                   relayerRewardToken,
                   relayerRewardTokens,
                   expires,
                   nonce);


                    const types = typedData.types;


                const typedDataHash = lavaTestUtils.getLavaTypedDataHash(typedData,types);


                  //https://github.com/ethers-io/ethers.js/issues/46/




                  var tuple = [
                  methodName,
                  relayAuthority,
                  from,
                  to,
                  walletAddress,
                  tokenAddress,
                  tokenAmount,
                  relayerRewardToken,
                  relayerRewardTokens,
                  expires,
                  nonce];

                    console.log('  tuple   ',   tuple  )



                ///msg hash signed is 0x9201073a01df85b87dab83ad2498bf5b2190bf62cb03b2a407ba7d77279a4ceb
                var lavaMsgHash = await walletContract.methods.getLavaTypedDataHash(  tuple ).call({from: test_account.address})
                console.log('lavaMsgHash',lavaMsgHash)
                console.log('typedDataHash.toString()',typedDataHash.toString('hex'))

                assert.equal(lavaMsgHash, '0x' + typedDataHash.toString('hex') ); //initialized




                //how to generate a good signature using web3 ?
                //---------------??????????????????????

                  var lavaPacketStruct =   typedData.packet

                  var privKey = Buffer.from(privateKey, 'hex')


              const sig = ethUtil.ecsign(typedDataHash , privKey );
              //    let sig = await web3.eth.sign(typedDataHash, privKey);
                  let signatureData = ethUtil.fromRpcSig(sig);

                console.log('@@ sig',  signatureData)

                console.log('@@ struct ',  lavaPacketStruct)

                var fullPacket = LavaTestUtils.getLavaPacket(
                  methodName,
                relayAuthority,
                from,
                to,
                walletAddress,
                tokenAddress,
                tokenAmount,
                relayerRewardToken,
                relayerRewardTokens,
                expires,
                nonce,
                signatureData
              )

                assert.equal(  LavaTestUtils.lavaPacketHasValidSignature( fallPacket ) , true   )


                //finish me

                //walletContract.methods.approveTokensWithSignature(    )
              /*  assert.equal(lavaPacketStruct.methodName ,  'approve'  )

                        if(lavaPacketStruct.methodName ==    'approve'  )
                        {

                        var response = await new Promise((resolve, reject) => {
                             walletContract.methods.approveTokensWithSignature(

                              lavaPacketStruct,
                              signatureData

                            ).send( {} , function(response){
                              resolve(response)
                            });

                            });///promise

                            console.log('res',response)
                            assert.ok(response); //initialized


                          }
                */


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


                       var methodname = 'approve'
                       var requiresKing = false
                       var from= addressFrom
                       var to= "0x357FfaDBdBEe756aA686Ef6843DA359E2a85229c"
                       var walletAddress=walletContract.address
                       var tokenAddress=tokenContract.address
                       var tokenAmount=2000000
                       var relayerReward=1000000
                       var expires=336504400
                       var nonce='0xc18f687c56f1b2749af7d6151fa351'
                       //var expectedSignature="0x8ef27391a81f77244bf95df58737eecac386ab9a47acd21bdb63757adf71ddf878169c18e4ab7b71d60f333c870258a0644ac7ade789d59c53b0ab75dbcc87d11b"

                        //add new code here !!

                       var typedData = lavaTestUtils.getLavaTypedDataFromParams(
                         methodname,
                         requiresKing,
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

                        var privKey = Buffer.from(privateKey, 'hex')

                      const sig = ethUtil.ecsign(typedDataHash , privKey );


                        console.log('@@ walletContract',  walletContract.address)

                        //https://github.com/ethers-io/ethers.js/issues/46/

                        var lavaPacketStruct =   typedData.packet
                        console.log('  lavaPacketStruct   ',   lavaPacketStruct  )

                        var tuple = [methodname,
                        requiresKing,
                        from,
                        to,
                        walletAddress,
                        tokenAddress,
                        tokenAmount,
                        relayerReward,
                        expires,
                        nonce];

                          console.log('  tuple   ',   tuple  )
                          console.log('  walletContract.methods   ',   walletContract.methods  )


                      ///msg hash signed is 0x9201073a01df85b87dab83ad2498bf5b2190bf62cb03b2a407ba7d77279a4ceb
                      var lavaMsgHash = await walletContract.methods.getLavaTypedDataHash('approve', tuple ).send()
                      console.log('lavaMsgHash',lavaMsgHash)

                      assert.equal(lavaMsgHash, msgHash ); //initialized


                      var signature = lavaTestUtils.signTypedData(privKey,msgParams);



                      lavaSignature = signature;
                      console.log('lava signatureaa',msgParams,signature)

                      msgParams.sig = signature;



                      var recoveredAddress = lavaTestUtils.recoverTypedSignature(msgParams);

                      assert.equal(recoveredAddress, test_account.address ); //initialized


                      console.log('result1', lavaMsgHash )


                      console.log('addressFrom',addressFrom)
                      console.log('meeep',[from,to,tokenAddress,tokenAmount,relayerReward,expires,nonce,signature])



                    //  var result = await walletContract.approveTokensWithSignature.call(from,to,tokenAddress,tokenAmount,relayerReward,expires,nonce )



                      var txData = web3.eth.abi.encodeFunctionCall({
                              name: 'approveTokensWithSignature',
                              type: 'function',
                              inputs: [
                                {
                                  "name": "packet",
                                  "type": "LavaPacket"
                                },
                                {
                                  "name": "signature",
                                  "type": "bytes"
                                }
                              ],
                                outputs: [
                                  {
                                    "name": "success",
                                    "type": "bool"
                                  }
                              ]
                          }, [typedData.packet,signature]);


                        try{
                            var txCount = await web3.eth.getTransactionCount(addressFrom);
                            console.log('txCount',txCount)
                           } catch(error) {  //here goes if someAsyncPromise() rejected}
                            console.log(error);

                             return error;    //this will result in a resolved promise.
                           }

                           var addressTo = walletContract.address;
                           var privateKey = test_account.privateKey;

                          const txOptions = {
                            nonce: web3utils.toHex(txCount),
                            gas: web3utils.toHex("1704624"),
                            gasPrice: web3utils.toHex(web3utils.toWei("4", 'gwei') ),
                            value: 0,
                            to: addressTo,
                            from: addressFrom,
                            data: txData
                          }



                        var txhash = await new Promise(function (result,error) {

                              sendSignedRawTransaction(web3,txOptions,addressFrom,privateKey, function(err, res) {
                              if (err) error(err)
                                result(res)
                            })

                          }.bind(this));



                          assert.ok(txhash)

                          var burnStatus = await walletContract.signatureBurnStatus.call(msgHash )

                          assert.equal( burnStatus.toNumber() , 0x1); //initialized

                    });






})


async function sendSignedRawTransaction(web3,txOptions,addressFrom,fullPrivKey,callback) {


  var privKey = truncate0xFromString( fullPrivKey )

  const privateKey = new Buffer( privKey, 'hex')
  const transaction = new Tx(txOptions)


  transaction.sign(privateKey)


  const serializedTx = transaction.serialize().toString('hex')

    try
    {
      var result =  web3.eth.sendSignedTransaction('0x' + serializedTx, callback)
    }catch(e)
    {
      console.log(e);
    }
}


 function truncate0xFromString(s)
{

  if(s.startsWith('0x')){
    return s.substring(2);
  }
  return s;
}

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
