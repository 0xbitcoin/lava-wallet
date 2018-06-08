
var web3utils = require('web3-utils')

module.exports = class LavaTestUtils{





  async signTypedData(params,privateKey,web3)
  {
    var result = await new Promise(async resolve => {

      console.log('signTypedData',params)

      //finish me !!! 

         var  hardcodedSchemaHash = '0x313236b6cd8d12125421e44528d8f5ba070a781aeac3e5ae45e314b818734ec3' ;

        var nonce = web3utils.toBN(nonce)

          var typedDataHash = web3utils.soliditySha3(
                  hardcodedSchemaHash,
                  web3utils.soliditySha3(from,to,walletAddress,tokenAddress,tokenAmount,relayerReward,expires,nonce)
                  );


        return typedDataHash;





      var method = 'eth_signTypedData'

              web3.currentProvider.sendAsync({
                method,
                params,
                from,
              }, function (err, result) {
                if (err) return console.dir(err)
                if (result.error) {
                  alert(result.error.message)
                }
                if (result.error) return console.error(result)
                console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))


                  //this method needs to be in solidity!
                const recovered = sigUtil.recoverTypedSignature({ data: params[0], sig: result.result })

                if (recovered === from ) {
                  alert('Successfully ecRecovered signer as ' + from)
                } else {
                  alert('Failed to verify signer when comparing ' + result + ' to ' + from)
                }

                  resolve(result.result)

              })


      });

      return result;
  }





}
