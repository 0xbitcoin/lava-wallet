var _0xBitcoinToken = artifacts.require("./_0xBitcoinToken.sol");

var miningKing = artifacts.require("./MiningKing.sol");

var wEthToken = artifacts.require("./WETH9.sol");

var ECRecovery = artifacts.require("./ECRecovery.sol");

var LavaWallet = artifacts.require("./LavaWallet.sol");

module.exports = function(deployer) {


  deployer.deploy(_0xBitcoinToken);


    deployer.deploy(miningKing);

  deployer.deploy(ECRecovery);


    deployer.link(ECRecovery, LavaWallet)

  deployer.deploy(LavaWallet);

  deployer.deploy(wEthToken);


};
