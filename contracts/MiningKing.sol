pragma solidity ^0.4.18;


import "./SafeMath.sol";


/*

This is a token wallet contract

Store your tokens in this contract to give them super powers

Tokens can be spent from the contract with only an ecSignature from the owner - onchain approve is not needed


*/

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
contract ERC918Interface {

  function epochCount() public constant returns (uint);

  function totalSupply() public constant returns (uint);
  function getMiningDifficulty() public constant returns (uint);
  function getMiningTarget() public constant returns (uint);
  function getMiningReward() public constant returns (uint);
  function balanceOf(address tokenOwner) public constant returns (uint balance);

  function mint(uint256 nonce, bytes32 challenge_digest) public returns (bool success);

  event Mint(address indexed from, uint reward_amount, uint epochCount, bytes32 newChallengeNumber);

}



contract proxyMinterInterface
{
  function proxyMint(uint256 nonce, bytes32 challenge_digest) public returns (bool success);
}


contract MiningKing   {


  using SafeMath for uint;


   address public miningKing;

   address public minedToken; // = 0xb6ed7644c69416d67b522e20bc294a9a9b405b31;


   event TransferKing(address from, address to);

  function MiningKing(address mintableToken) public  {
    minedToken = mintableToken;
  }


  //do not allow ether to enter
  function() public payable {
      revert();
  }

  function getMiningKing() public returns (address king)
  {
    return miningKing;
  }

   function transferKing(address newKing) public   {

       require(msg.sender == miningKing);

       miningKing = newKing;

       TransferKing(msg.sender, newKing);

   }


/**
Set the king to the Ethereum Address which is encoded as 160 bits of the 256 bit mining nonce


**/

//proxyMintWithKing
   function mintForwarder(uint256 nonce, bytes32 challenge_digest, address proxyMinter) returns (bool)
   {

     bytes memory nonceBytes = toBytesAddress(nonce);

     address newKing = bytesToAddress(nonceBytes);

      uint previousEpochCount = ERC918Interface(minedToken).epochCount();

    // uint totalReward = ERC918Interface(minedToken).getMiningReward();
     require(proxyMinterInterface(proxyMinter).proxyMint(nonce, challenge_digest));//pool's owned  mint contract

     //make sure that the minedToken really was proxy minted
    require(  ERC918Interface(minedToken).epochCount() == previousEpochCount + 1 );

     miningKing = newKing;

     return true;
   }



 function toBytesAddress(uint256 x) constant returns (bytes b) {
        //b = new bytes(20);
        //assembly { mstore(add(b, 20), x) }

        b = new bytes(20);
       for (uint i = 0; i < 20; i++) {
           b[i] = byte(uint8(x / (2**(8*(19 - i)))));
       }


    }


 function bytesToAddress (bytes b) constant returns (address) {
     uint result = 0;
     for (uint i = 0; i < b.length; i++) {
         uint c = uint(b[i]);
         if (c >= 48 && c <= 57) {
             result = result * 16 + (c - 48);
         }
         if(c >= 65 && c<= 90) {
             result = result * 16 + (c - 55);
         }
         if(c >= 97 && c<= 122) {
             result = result * 16 + (c - 87);
         }
     }
     return address(result);
 }




}
