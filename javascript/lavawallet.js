
var INFURA_ROPSTEN_URL = 'https://ropsten.infura.io/gmXEVo5luMPUGPqg6mhy';
var INFURA_MAINNET_URL = 'https://mainnet.infura.io/gmXEVo5luMPUGPqg6mhy';

var Web3 = require('web3');
var web3Utils = require('web3-utils');
var web3 = new Web3();

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


        var remoteCallData = '0x01';
        var depositAmount = 5;

        var fromAddress = accountConfig.address;


      web3.eth.call({
        to: fromAddress,
        data: tokenContractInstance.methods.approveAndCall(LavaWalletRopstenAddress, depositAmount, remoteCallData ).encodeABI()
    }).then(function( result){
 
      console.log(result);
      return result;
    })






  }



}
