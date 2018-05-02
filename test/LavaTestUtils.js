
class LavaTestUtils{





  async signTypedData(params,from)
  {
    var result = await new Promise(async resolve => {

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

export default LavaTestUtils ;
