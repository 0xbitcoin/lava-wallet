
var web3utils = require('web3-utils')

var ethSigUtil = require('eth-sig-util')
/*

  1) signTypedData - accepts data and signs it with the private key just like Metamask

  2)TODO recoverSignerAddress



*/



module.exports = class LavaTestUtils{




   signTypedData(privateKey, params)
  {

    //var hardcodedSchemaHash = '0x313236b6cd8d12125421e44528d8f5ba070a781aeac3e5ae45e314b818734ec3' ;
    return ethSigUtil.signTypedData(privateKey,params)


  }

  recoverTypedSignature(params)
 {

    return ethSigUtil.recoverTypedSignature(params)

 }


  /*

  ethSigUtil.recoverTypedSignature: function (msgParams) {
   const msgHash = typedSignatureHash(msgParams.data)
   const publicKey = recoverPublicKey(msgHash, msgParams.sig)
   const sender = ethUtil.publicToAddress(publicKey)
   return ethUtil.bufferToHex(sender)
 }

  */



}
