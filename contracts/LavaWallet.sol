pragma solidity ^0.4.18;

import "./ECRecovery.sol";
import "./SafeMath.sol";


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


  using SafeMath for uint;

  // balances[tokenContractAddress][EthereumAccountAddress] = 0
  mapping(address => mapping (address => uint256)) balances;
  mapping(bytes32 => uint256) burnedSignatures;


  function LavaWallet() public  {

  }


  function balanceOf(address tokenContract,address tokenOwner) public constant returns (uint balance) {
       return balances[tokenContract][tokenOwner];
   }

   function signatureSpent(bytes32 digest) public view returns (bool)
   {
     return (burnedSignatures[digest] == 0x0);
   }


   function burnSignature(address to, uint256 tokens, address token, uint256 checkNumber, bytes32 sigHash, bytes signature) public returns (bool)
   {
       address recoveredSignatureSigner = ECRecovery.recover(sigHash,signature);

       //maker sure the invalidator is the signer
       if(recoveredSignatureSigner != msg.sender) revert();

       bytes32 sigDigest = keccak256(to, tokens, token, checkNumber);

       if(sigDigest != sigHash) revert();

       //make sure this signature has never been used
       uint burnedSignature = burnedSignatures[sigDigest];
       burnedSignatures[sigDigest] = 0x2; //invalidated
       if(burnedSignature != 0x0 ) revert();

       return true;
   }


   //performed via an ApproveAndCall
  function _depositTokens(address from, uint256 tokens, address token) internal returns (bool)
  {
      if(msg.sender != token) revert(); //must come from ApproveAndCall
      if(tokens <= 0) revert(); //need to deposit some tokens

      //we already have approval so lets do a transferFrom - transfer the tokens into this contract
      ERC20Interface(token).transferFrom(from, this, tokens);
      balances[token][from] = balances[token][from].add(tokens);

      return true;
  }

  function withdrawTokensFrom(address from, uint256 tokens, address token, uint256 checkNumber, bytes32 sigHash, bytes signature) public returns (bool)
  {
      //check to make sure that signature == ecrecover signature

      address recoveredSignatureSigner = ECRecovery.recover(sigHash,signature);

      //make sure the signer is the depositor of the tokens
      if(from != recoveredSignatureSigner) revert();

      //make sure the signed hash incorporates the token recipient, quantity to withdraw, and the check number
      bytes32 sigDigest = keccak256(msg.sender, tokens, token, checkNumber);

      //make sure this signature has never been used
      uint burnedSignature = burnedSignatures[sigDigest];
      burnedSignatures[sigDigest] = 0x1; //spent
      if(burnedSignature != 0x0 ) revert();

      //make sure the data being signed (sigHash) really does match the msg.sender, tokens, and checkNumber
      if(sigDigest != sigHash) revert();

      //make sure the token-depositor has enough tokens in escrow
      if(balanceOf(token, from) < tokens) revert();

      //finally, transfer the tokens out of this contracts escrow to msg.sender
      balances[token][from].sub(tokens);
      ERC20Interface(token).transfer(msg.sender, tokens);


      return true;
  }

   /*
     Receive approval to spend tokens and perform any action all in one transaction
   */
 function receiveApproval(address from, uint256 tokens, address token, bytes data) public returns (bool) {

   //parse the data:   first byte is for 'action_id'
   byte action_id = data[0];

   if(action_id == 0x1)
   {
     return _depositTokens(from, tokens, token);
   }

   return false;
   //return false;

 }


}
