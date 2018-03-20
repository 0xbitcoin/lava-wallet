
var INFURA_ROPSTEN_URL = 'https://ropsten.infura.io/gmXEVo5luMPUGPqg6mhy';
var INFURA_MAINNET_URL = 'https://mainnet.infura.io/gmXEVo5luMPUGPqg6mhy';

var Web3 = require('web3');
var web3utils = require('web3-utils');
var web3 = new Web3();
const Tx = require('ethereumjs-tx')

var LavaWalletRopstenAddress = "0x9813d3792CDCb58f4F177ec953120360906c5b21";
var _0xBitcoinRopstenAddress = "0x9D2Cc383E677292ed87f63586086CfF62a009010";

var _0xBitcoinABI = require('./abi/_0xBitcoinToken.json');
var LavaWalletABI = require('./abi/LavaWallet.json');


  var accountConfig = require('./account.config').account;

module.exports =  {


  constructor() {

  },




    getWeb3ContractInstance(contract_address, contract_abi )
  {
      return new web3.eth.Contract(contract_abi,contract_address)
  },


    async init()
  {
    console.log("Using test mode!!! - Ropsten ");
    web3.setProvider(INFURA_ROPSTEN_URL);

    var tokenContractInstance = this.getWeb3ContractInstance(
      _0xBitcoinRopstenAddress,_0xBitcoinABI.abi);

    var walletContractInstance = this.getWeb3ContractInstance(
      LavaWalletRopstenAddress,LavaWalletABI.abi);


      var privateKey = accountConfig.privateKey;

      const gasPrice = web3.eth.gasPrice;
      const gasPriceHex = web3utils.toHex(gasPrice);
      const gasLimitHex = web3utils.toHex(3000000);

        var remoteCallData = '0x01';
        var depositAmount = web3utils.toBN(5);

        var addressFrom = accountConfig.address;
        var addressTo = _0xBitcoinRopstenAddress;

      var txData = web3.eth.abi.encodeFunctionCall({
              name: 'approveAndCall',
              type: 'function',
              inputs: [
                {
                  "name": "spender",
                  "type": "address"
                },
                {
                  "name": "tokens",
                  "type": "uint256"
                },
                {
                  "name": "data",
                  "type": "bytes"
                }],
                outputs: [
                  {
                    "name": "success",
                    "type": "bool"
                  }
              ]
          }, [LavaWalletRopstenAddress, depositAmount, remoteCallData]);


          try{
            var txCount = await web3.eth.getTransactionCount(addressFrom);
            console.log('txCount',txCount)
           } catch(error) {  //here goes if someAsyncPromise() rejected}
            console.log(error);

             return error;    //this will result in a resolved promise.
           }



          const txOptions = {
            nonce: web3utils.toHex(txCount),
            gas: web3utils.toHex("1704624"),
            gasPrice: web3utils.toHex(web3utils.toWei("4", 'gwei') ),
            value: 0,
            to: addressTo,
            from: addressFrom,
            data: txData
          }



        return new Promise(function (result,error) {

             this.sendSignedRawTransaction(web3,txOptions,addressFrom,privateKey, function(err, res) {
              if (err) error(err)
                result(res)
            })

          }.bind(this));

                  /*
      console.log(tra )

      var tx = new Tx(tra);
      tx.sign(key);

      var stx = tx.serialize();
      web3.eth.sendTransaction('0x' + stx.toString('hex'), (err, hash) => {
          if (err) { console.log(err); return; }
          console.log(' tx: ' + hash);
      });


     tokenContractInstance.methods.approveAndCall(LavaWalletRopstenAddress, depositAmount, remoteCallData ).send({
          from: ,

        })


      //  tokenContractInstance.methods.approveAndCall(LavaWalletRopstenAddress, depositAmount, remoteCallData ).send()
      web3.eth.call({
        to: _0xBitcoinRopstenAddress,
        from: fromAddress,
        data: tokenContractInstance.methods.approveAndCall(LavaWalletRopstenAddress, depositAmount, remoteCallData ).encodeABI()
    }).then(function(  result){

      console.log(result);
      return result;
    })
*/





},



  async sendSignedRawTransaction(web3,txOptions,addressFrom,private_key,callback) {

    var privKey = this.truncate0xFromString( private_key )

    const privateKey = new Buffer( privKey, 'hex')
    const transaction = new Tx(txOptions)


    transaction.sign(privateKey)


    const serializedTx = transaction.serialize().toString('hex')

      try
      {
        var result =  web3.eth.sendSignedTransaction('0x' + serializedTx, callback)
      }catch(e)
      {
        console.log('error',e);
      }
  },




       truncate0xFromString(s)
      {
        if(s.startsWith('0x')){
          return s.substring(2);
        }
        return s;
      }




}
