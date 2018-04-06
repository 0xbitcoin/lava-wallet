pragma solidity ^0.4.18;

import "./ECRecovery.sol";
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


//wEth interface
contract WrapperInterface
{
  function() public payable;
  function deposit() public payable ;
  function withdraw(uint wad) public;
  function totalSupply() public view returns (uint);
  function approve(address guy, uint wad) public returns (bool);
  function transfer(address dst, uint wad) public returns (bool);
  function transferFrom(address src, address dst, uint wad);


  event  Approval(address indexed src, address indexed guy, uint wad);
  event  Transfer(address indexed src, address indexed dst, uint wad);
  event  Deposit(address indexed dst, uint wad);
  event  Withdrawal(address indexed src, uint wad);

}





contract LavaWallet {


  using SafeMath for uint;

  // balances[tokenContractAddress][EthereumAccountAddress] = 0
   mapping(address => mapping (address => uint256)) balances;

   //token => owner => spender : amount
   mapping(address => mapping (address => mapping (address => uint256))) allowed;


   //like orderFills in lavadex..
   //how much of the offchain sig approval has been 'drained' or used up
   mapping (address => mapping (bytes32 => uint)) public signatureApprovalDrained; //mapping of user accounts to mapping of order hashes to uints (amount of order that has been filled)


   //deprecated
   mapping(bytes32 => uint256) burnedSignatures;


  event Deposit(address token, address user, uint amount, uint balance);
  event Withdraw(address token, address user, uint amount, uint balance);
  event Transfer(address indexed from, address indexed to,address token, uint tokens);
  event Approval(address indexed tokenOwner, address indexed spender,address token, uint tokens);

  function LavaWallet() public  {

  }


  //do not allow ether to enter
  function() public payable {
      revert();
  }


  //send Ether into this method, it gets wrapped and then deposited in this contract as a token balance assigned to the sender
  function depositAndWrap(address wrappingContract, address preApprove) public payable
  {
    //convert the eth into wEth

    //send this payable ether into the wrapping contract
    wrappingContract.transfer(msg.value);

    //send the tokens from the wrapping contract to here
    WrapperInterface(wrappingContract).transfer(this, msg.value);

    balances[wrappingContract][msg.sender] = balances[wrappingContract][msg.sender].add(msg.value);

    assert(this.balance == 0); //make sure it is not a faulty wrapping contract

    if(preApprove != 0x0)
    {
      approveMoreTokens(preApprove,wrappingContract,msg.value);
    }

    Deposit(wrappingContract, msg.sender, msg.value, balances[wrappingContract][msg.sender]);
  }

  //when this contract has control of wrapped eth, this is a way to easily withdraw it as ether
  function unwrapAndWithdraw(address token, uint256 tokens) public
  {
      //transfer the tokens into the wrapping contract which is also the token contract
      transferTokens(token,token,tokens);

      WrapperInterface(token).withdraw(tokens);

      //send ether to the token-sender
      msg.sender.transfer(tokens);

      assert(this.balance == 0); //make sure it is not a faulty wrapping contract

      Withdraw(token, msg.sender, tokens, balances[token][msg.sender]);

  }


   //remember you need pre-approval for this - nice with ApproveAndCall
  function depositTokens(address from, address token, uint256 tokens, address preApprove) public returns (bool)
  {
      //we already have approval so lets do a transferFrom - transfer the tokens into this contract
      ERC20Interface(token).transferFrom(from, this, tokens);
      balances[token][from] = balances[token][from].add(tokens);

      if(preApprove != 0x0)
      {
        approveMoreTokens(preApprove,token,tokens);
      }

      Deposit(token, from, tokens, balances[token][from]);

      return true;
  }

  function withdrawTokens(address token, uint256 tokens) {

    if (balances[token][msg.sender] < tokens) revert();

    balances[token][msg.sender] = balances[token][msg.sender].sub(tokens);

    ERC20Interface(token).transfer(msg.sender, tokens);

    Withdraw(token, msg.sender, tokens, balances[token][msg.sender]);
  }

  function balanceOf(address token,address user) public constant returns (uint) {
       return balances[token][user];
   }

 function transferTokens(address to, address token, uint tokens) public returns (bool success) {
      balances[token][msg.sender] = balances[token][msg.sender].sub(tokens);
      balances[token][to] = balances[token][to].add(tokens);
      Transfer(msg.sender, token, to, tokens);
      return true;
  }


  //remember... can also be used to remove approval by using a 'tokens' value of 0
  function approveTokens(address spender, address token, uint tokens) public returns (bool success) {
      allowed[token][msg.sender][spender] = tokens;
      Approval(msg.sender, token, spender, tokens);
      return true;
  }

   function approveMoreTokens(address spender, address token, uint tokens) public returns (bool success) {
       allowed[token][msg.sender][spender] = allowed[token][msg.sender][spender].add(tokens);
       Approval(msg.sender, token, spender, allowed[token][msg.sender][spender]);
       return true;
   }


   function transferTokensFrom( address from, address to,address token,  uint tokens) public returns (bool success) {
       balances[token][from] = balances[token][from].sub(tokens);
       allowed[token][from][msg.sender] = allowed[token][from][msg.sender].sub(tokens);
       balances[token][to] = balances[token][to].add(tokens);
       Transfer(token, from, to, tokens);
       return true;
   }

   //nonce is the same thing as a 'check number'


   function approveTokensWithSignature(address from, address to,  uint256 tokens, address token,
                                     uint256 expires, uint256 nonce, bytes signature) public returns (bool)
   {
      bytes32 sigHash = sha3("\x19Ethereum Signed Message:\n32",this, from, to, token, tokens, expires, nonce);

       address recoveredSignatureSigner = ECRecovery.recover(sigHash,signature);

       //make sure the signer is the depositor of the tokens
       if(from != recoveredSignatureSigner) revert();

       //make sure the signature has not expired
       if(block.number > expires) revert();



       uint burnedSignature = burnedSignatures[sigHash];
       burnedSignatures[sigHash] = 0x1; //spent
       if(burnedSignature != 0x0 ) revert();


       allowed[token][from][to] = tokens;
       Approval(from, token, to, tokens);
       return true;


   }

   //allows transfer without approval as long as you get an EC signature
  function transferTokensFromWithSignature(address from, address to, uint256 tokensApproved, uint256 tokens, address token,
                                    uint256 expires, uint256 nonce, bytes signature) public returns (bool)
  {
      //check to make sure that signature == ecrecover signature

      if(!approveTokensWithSignature(from,to,tokensApproved,token,expires,nonce,signature)) revert();

      //it can be requested that fewer tokens be sent that were approved -- the whole approval will be invalidated though
      return transferTokensFrom( from, to, token, tokens);

  }


    function tokenAllowance(address token, address tokenOwner, address spender) public constant returns (uint remaining) {

        return allowed[token][tokenOwner][spender];

    }



     function burnSignature(address from, address to, uint256 tokens, address token, uint256 expires, uint256 nonce,  bytes signature) public returns (bool)
     {

       bytes32 sigHash = sha3("\x19Ethereum Signed Message:\n32",this, from, to, token, tokens, expires, nonce);


         address recoveredSignatureSigner = ECRecovery.recover(sigHash,signature);

         //maker sure the invalidator is the signer
         if(recoveredSignatureSigner != from) revert();


         //make sure this signature has never been used
         uint burnedSignature = burnedSignatures[sigHash];
         burnedSignatures[sigHash] = 0x2; //invalidated
         if(burnedSignature != 0x0 ) revert();

         return true;
     }

     function signatureBurned(bytes32 digest) public view returns (bool)
     {
       return (burnedSignatures[digest] != 0x0);
     }


   /*
     Receive approval to spend tokens and perform any action all in one transaction
   */
 function receiveApproval(address from, uint256 tokens, address token, bytes data) public returns (bool) {

   //parse the data:   first byte is for 'action_id'
   //byte action_id = data[0];

    address preApprove = 0x0;
   //will this work ?
   if(data.length == 20)
   {
     preApprove = bytesToAddress(data);
   }

   return depositTokens(from, token, tokens, preApprove);

 }

 //Usage
//address addr = bytesToAddress("0xa462d983B4b8C855e1876e8c24889CBa466A67EB");
function bytesToAddress(bytes _address) public pure returns (address) {
   uint160 m = 0;
   uint160 b = 0;

   for (uint8 i = 0; i < 20; i++) {
     m *= 256;
     b = uint160(_address[i]);
     m += (b);
   }

   return address(m);
 }



}
