
var web3utils = require('web3-utils')
const ethUtil = require('ethereumjs-util')
var ethSigUtil = require('eth-sig-util')
var EIP712Helper = require("./EIP712Helper");


/*

  1) signTypedData - accepts data and signs it with the private key just like Metamask

  2)TODO recoverSignerAddress



*/



module.exports = class LavaTestUtils{




   signTypedData(privateKey, msgParams)
  {

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
    var hardcodedSchemaHash = '0x8fd4f9177556bbc74d0710c8bdda543afd18cc84d92d64b5620d5f1881dceb37' ;
    return hardcodedSchemaHash;
 }

 getLavaTypedDataHash(typedData,types)
 {
   var typedDataHash = ethUtil.sha3(
       Buffer.concat([
           Buffer.from('1901', 'hex'),
           EIP712Helper.structHash('EIP712Domain', typedData.domain, types),
           EIP712Helper.structHash(typedData.primaryType, typedData.packet, types),
       ]),
   );

   return typedDataHash;
 }

 getLavaTypedDataFromParams(methodName,relayMode,from,to,walletAddress,tokenAddress,tokenAmount,relayerReward,expires,nonce)
 {
   const typedData = {
           types: {
               EIP712Domain: [
                   { name: 'name', type: 'string' },
                   { name: 'verifyingContract', type: 'address' }
               ],
               LavaPacket: [
                   { name: 'methodName', type: 'bytes' },  //?
                   { name: 'relayMode', type: 'string' },
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
               verifyingContract: walletAddress,
           },
           packet: {
               methodName: methodName,
               relayMode: relayMode,
               from: from,
               to: to,
               wallet: walletAddress,
               token: tokenAddress,
               tokens: tokenAmount,
               relayerReward: relayerReward,
               expires: expires,
               nonce: nonce,
           },
       };





     return typedData;
 }


 static bufferToHex(buffer)
 {
    return '0x' + buffer.toString('hex')
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
