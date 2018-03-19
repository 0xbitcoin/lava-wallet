pragma solidity ^0.4.18;


/**
 * @title Eliptic curve signature operations
 *
 * @dev Based on https://gist.github.com/axic/5b33912c6f61ae6fd96d6c4a47afde6d
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  /**
  * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

library ECRecovery {

  /**
   * @dev Recover signer address from a message by using their signature
   * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
   * @param sig bytes signature, the signature is generated using web3.eth.sign()
   */
  function recover(bytes32 hash, bytes sig) public pure returns (address) {
    bytes32 r;
    bytes32 s;
    uint8 v;

    //Check the signature length
    if (sig.length != 65) {
      return (address(0));
    }

    // Divide the signature in r, s and v variables
    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := byte(0, mload(add(sig, 96)))
    }

    // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
    if (v < 27) {
      v += 27;
    }

    // If the version is correct return the signer address
    if (v != 27 && v != 28) {
      return (address(0));
    } else {
      return ecrecover(hash, v, r, s);
    }
  }

}

contract ERC20Interface {
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

contract LavaWallet {


  // balances[tokenContractAddress][EthereumAccountAddress] = 0
  mapping(address => mapping (address => uint256)) balances;
  mapping(bytes32 => uint256) spentSignatures;

  function LavaWallet() internal  {

  }


  function balanceOf(address tokenContract,address tokenOwner) public constant returns (uint balance) {
       return balances[tokenContract][tokenOwner];
   }

/*
   function invalidateSignature()
   {

   }
*/


   //performed via an ApproveAndCall
  function _depositTokens(address from, uint256 tokens, address token) internal
  {

      if(msg.sender != token) revert(); //must come from ApproveAndCall
      if(tokens <= 0) revert(); //need to deposit some tokens

      //we already have approval so lets do a transferFrom - transfer the tokens into this contract
      ERC20Interface().transferFrom(from, this, tokens);
      balances[token][from].add(tokens);


  }

  function withdrawTokensFrom(address from, uint256 tokens, address token, bytes32 sigHash, bytes signature) public
  {
      //check to make sure that signature == ecrecover signature

      recoveredSignatureSigner = ECRecovery.recover(sigHash,signature);

      //make sure the signer is the depositor of the tokens
      if(from != recoveredSignatureSigner) revert();

      //make sure the signed hash incorporates the token recipient, quantity to withdraw, and the check number
      bytes32 sigDigest = keccak256(msg.sender, tokens, checkNumber);

      //make sure this signature has never been used
      uint spentSignature = spentSignatures[sigDigest];
      spentSignatures[sigDigest] = 0x1;
      if(spentSignature != 0x0 ) revert();

      if(sigDigest != sigHash) revert();

      //make sure the token-depositor has enough tokens in escrow
      if(balanceOf(token, from) < tokens) revert();

      //finally, transfer the tokens out of this contracts escrow to msg.sender
      ERC20Interface(token).transfer(msg.sender, tokens);
  }

   /*
     Receive approval to spend tokens and perform any action all in one transaction
   */
 function receiveApproval(address from, uint256 tokens, address token, bytes data) public {

   //parse the data:   first byte is for 'action_id'
   byte action_id = data[0];

   if(action_id == 0x1)
   {
     _depositTokens(from, tokens, token);
   }



 }


}
