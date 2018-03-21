var ECRecovery = artifacts.require("./ECRecovery.sol");

var LavaWallet = artifacts.require("./LavaWallet.sol");

module.exports = function(deployer) {
  deployer.deploy(ECRecovery);


    deployer.link(ECRecovery, LavaWallet)

  deployer.deploy(LavaWallet);

};
