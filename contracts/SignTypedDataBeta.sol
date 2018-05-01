pragma solidity ^0.4.18;

import "./ECRecovery.sol";

/**
 * SignTypedDataBeta
 *
 */
library SignTypedDataBeta {



  	function hashTypedData(string message) internal pure returns (bytes32) {
  	  return keccak256(
  	    keccak256('string message'),
  	    keccak256(message)
      );
  	}

  	function checkSignature(string message, bytes32 r, bytes32 s, uint8 v) internal pure returns (address) {
  	  var hash = hashTypedData(message);
      return ecrecover(hash, v, r, s);
  	}





}
