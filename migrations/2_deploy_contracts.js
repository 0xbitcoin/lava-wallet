var _0xBitcoinToken = artifacts.require("./_0xBitcoinToken.sol");

var MiningKing = artifacts.require("./MiningKing.sol");

var wEthToken = artifacts.require("./WETH9.sol");

var ECRecovery = artifacts.require("./ECRecovery.sol");

var LavaWallet = artifacts.require("./LavaWallet.sol");

module.exports = function(deployer) {

  deployer.deploy(ECRecovery);


    deployer.link(ECRecovery, LavaWallet)
    deployer.deploy(wEthToken);

  return deployer.deploy(_0xBitcoinToken).then(function(){
    console.log('deploy 1 ')
    return deployer.deploy(MiningKing, _0xBitcoinToken.address).then(function(){
        console.log('deploy 2 ',  MiningKing.address)
      return deployer.deploy(LavaWallet, MiningKing.address).then(function(){
          console.log('deploy 3 ',  LavaWallet.address)
           return LavaWallet.deployed()
      });

    });
     
  });

  //  deployer.deploy(miningKing);






};
