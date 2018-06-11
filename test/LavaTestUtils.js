
var web3utils = require('web3-utils')
const ethUtil = require('ethereumjs-util')
var ethSigUtil = require('eth-sig-util')
/*

  1) signTypedData - accepts data and signs it with the private key just like Metamask

  2)TODO recoverSignerAddress



*/



module.exports = class LavaTestUtils{




   signTypedData(privateKey, msgParams)
  {

    //var hardcodedSchemaHash = '0x313236b6cd8d12125421e44528d8f5ba070a781aeac3e5ae45e314b818734ec3' ;
    //return ethSigUtil.signTypedData(privateKey,msgParams)


    const msgHash = ethSigUtil.typedSignatureHash(msgParams.data)
    console.log('msghash1',msgHash)

    var msgBuffer= ethUtil.toBuffer(msgHash)

    const sig = ethUtil.ecsign(msgBuffer, privateKey)
    return ethUtil.bufferToHex(ethSigUtil.concatSig(sig.v, sig.r, sig.s))

  }



  recoverTypedSignature(params)
 {

    return ethSigUtil.recoverTypedSignature(params)

 }


 /**
 * @param typedData - Array of data along with types, as per EIP712.
 * @returns Buffer

function typedSignatureHash(typedData) {
  const error = new Error('Expect argument to be non-empty array')
  if (typeof typedData !== 'object' || !typedData.length) throw error

  const data = typedData.map(function (e) {
    return e.type === 'bytes' ? ethUtil.toBuffer(e.value) : e.value
  })
  const types = typedData.map(function (e) { return e.type })
  const schema = typedData.map(function (e) {
    if (!e.name) throw error
    return e.type + ' ' + e.name
  })

  return ethAbi.soliditySHA3(
    ['bytes32', 'bytes32'],
    [
      ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema),
      ethAbi.soliditySHA3(types, data)
    ]
  )
}
 */




 getLavaPacketSchemaHash()
 {
    var hardcodedSchemaHash = '0x313236b6cd8d12125421e44528d8f5ba070a781aeac3e5ae45e314b818734ec3' ;
    return hardcodedSchemaHash;
 }

 getLavaParamsFromData(from,to,walletAddress,tokenAddress,tokenAmount,relayerReward,expires,nonce)
 {
     var params = [

       {
         type: 'address',
         name: 'from',
         value: from
       },
       {
         type: 'address',
         name: 'to',
         value: to
       },
       {
         type: 'address',
         name: 'walletAddress',
         value: walletAddress
       },
       {
         type: 'address',
         name: 'tokenAddress',
         value: tokenAddress
       },
       {
         type: 'uint256',
         name: 'tokenAmount',
         value: tokenAmount
       },
       {
         type: 'uint256',
         name: 'relayerReward',
         value: relayerReward
       },
       {
         type: 'uint256',
         name: 'expires',
         value: expires
       },
       {
         type: 'uint256',
         name: 'nonce',
         value: nonce
       },
     ]

     return params;
 }

  /*

  ethSigUtil.recoverTypedSignature: function (msgParams) {
   const msgHash = typedSignatureHash(msgParams.data)
   const publicKey = recoverPublicKey(msgHash, msgParams.sig)
   const sender = ethUtil.publicToAddress(publicKey)
   return ethUtil.bufferToHex(sender)
 }




 function typedSignatureHash(typedData) {
   const error = new Error('Expect argument to be non-empty array')
   if (typeof typedData !== 'object' || !typedData.length) throw error

   const data = typedData.map(function (e) {
     return e.type === 'bytes' ? ethUtil.toBuffer(e.value) : e.value
   })
   const types = typedData.map(function (e) { return e.type })
   const schema = typedData.map(function (e) {
     if (!e.name) throw error
     return e.type + ' ' + e.name
   })



 console.log('schema',new Array(typedData.length).fill('string'),schema)
   console.log('schema subhash',ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema).toString('hex'))

   console.log('types',types, data)
   console.log('types subhash',ethAbi.soliditySHA3(types, data).toString('hex'))


   console.log("hash1", ethAbi.soliditySHA3(
     ['bytes32', 'bytes32'],
     [
       ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema),
       ethAbi.soliditySHA3(types, data)
     ]
   ))

   //need to hardcode the 0x64fcd ... into solidity !!
   console.log("hash2", ethAbi.soliditySHA3(
     ['bytes32', 'bytes32'],
     [
       '0x313236b6cd8d12125421e44528d8f5ba070a781aeac3e5ae45e314b818734ec3',
       ethAbi.soliditySHA3(types, data)
     ]
   ))


   return ethAbi.soliditySHA3(
     ['bytes32', 'bytes32'],
     [
       ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema),
       ethAbi.soliditySHA3(types, data)
     ]
   )
 }




  */



}
