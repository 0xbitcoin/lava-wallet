var _0xBitcoinToken = artifacts.require("./_0xBitcoinToken.sol");

var ECRecovery = artifacts.require("./ECRecovery.sol");

var LavaWallet = artifacts.require("./LavaWallet.sol");

module.exports = function(deployer) {


  deployer.deploy(_0xBitcoinToken);




  deployer.deploy(ECRecovery);


    deployer.link(ECRecovery, LavaWallet)

  deployer.deploy(LavaWallet);

};
