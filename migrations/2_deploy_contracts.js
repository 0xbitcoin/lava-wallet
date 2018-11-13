var _0xBitcoinToken = artifacts.require("./_0xBitcoinToken.sol");

var MiningDelegate = artifacts.require("./MiningDelegate.sol");

var wEthToken = artifacts.require("./WETH9.sol");

var ECRecovery = artifacts.require("./ECRecovery.sol");

var MintHelper = artifacts.require("./MintHelper.sol");

var LavaWallet = artifacts.require("./LavaWallet.sol");

var DoubleKingsReward = artifacts.require("./DoubleKingsReward.sol")

module.exports = function(deployer) {

  deployer.deploy(ECRecovery);


    deployer.link(ECRecovery, LavaWallet)
    deployer.deploy(wEthToken);

  return deployer.deploy(_0xBitcoinToken).then(function(){
    console.log('deploy 1 ')
    return deployer.deploy(MintHelper, _0xBitcoinToken.address, 0, 0 ).then(function(){
      console.log('deploy x', _0xBitcoinToken.address)

        return deployer.deploy(MiningDelegate, _0xBitcoinToken.address).then(function(){   //issue ??
            console.log('deploy 2 ',  MiningDelegate.address)




            return deployer.deploy(LavaWallet).then(function(){
                console.log('deploy 3 ',  LavaWallet.address)
                 return LavaWallet.deployed()
          });



      });
    });

  });

  //  deployer.deploy(miningKing);






};
