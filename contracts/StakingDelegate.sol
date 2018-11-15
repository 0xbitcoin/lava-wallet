pragma solidity ^0.4.18;



/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
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


/*

This is a King Of The Hill contract which requires Proof of Work (hashpower) to set the king

This global non-owned contract proxy-mints 0xBTC through a personally-owned mintHelper contract (MintHelper.sol)

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

contract mintForwarderInterface
{
  function mintForwarder(uint256 nonce, bytes32 challenge_digest, address[] proxyMintArray) public returns (bool success);
}

contract proxyMinterInterface
{
  function proxyMint(uint256 nonce, bytes32 challenge_digest) public returns (bool success);
}


contract RelayAuthorityInterface {
    function getRelayAuthority() view public returns (address);
}


contract StakingDelegate is  RelayAuthorityInterface {


    using SafeMath for uint;
  
  

   //There are 50 slots, can overwrite one by staking enough tokens
   address[] stakers;
   address[] stakerAuthorities;
   mapping(uint => uint) amountStaked; 
   
   uint[] stakingLockBlock; //The block at which the staker is allowed to withdraw their stake 
   
   public uint numberOfStakers = 15;  //A constant 

   mapping(address => uint) balances;


  
   address public minedToken;



    event Deposit(address token, address user, uint amount, uint balance);
    event Withdraw(address token, address user, uint amount, uint balance);


   // 0xBTC is 0xb6ed7644c69416d67b522e20bc294a9a9b405b31;
  constructor(address mintableToken) public  {
    minedToken = mintableToken;
  }


  //do not allow ether to enter
  function() public payable {
      revert();
  }


  function startStaking(uint tokens , uint stakerIndex, address authority)
  {
    require( amountStaked[stakerIndex] < tokens);
    require( stakerIndex < numberOfStakers );
    stakers[stakerIndex] != msg.sender;
    
    stakingLockBlock[stakerIndex] = getEpochNumber() + 100;
     
    balances[msg.sender] = balances[msg.sender].sub(tokens);
    amountStaked[stakerIndex] = amountStaked[msg.sender].add(tokens);
    stakers[stakerIndex] = msg.sender;
    stakerAuthorities[stakerIndex] = authority;

    return true;
  }

  function stopStaking(uint tokens , uint stakerIndex)
  {
    require( amountStaked[stakerIndex] >= tokens );
    require( stakers[stakerIndex] = msg.sender );
    require( stakerIndex < numberOfStakers );    
    require( getEpochNumber() > stakingLockBlock[stakerIndex]); 

    amountStaked[stakerIndex] = amountStaked[msg.sender].sub(tokens);
    stakers[stakerIndex] = 0x0;
    stakerAuthorities[stakerIndex] = 0x0;
    balances[msg.sender] = balances[msg.sender].add(tokens);    

    return true;
  }


  /*
  Remember this number is only psuedorandom and can be manipulated
  */
  function getRelayAuthority() view public returns (address king)
  {    
    uint stakerIndex = getEpochNumber() % numberOfStakers;

    return stakerAuthorities[stakerIndex];
  }
  
  
  function getEpochNumber() view public returns (uint count)
  {
    return  ERC918Interface(mintableToken).epochCount;
  }



function depositTokens(address from, address token, uint256 tokens ) public returns (bool success)
  {
      //we already have approval so lets do a transferFrom - transfer the tokens into this contract

      require(ERC20Interface(token).transferFrom(from, this, tokens));

      balances[token][from] = balances[token][from].add(tokens);
   
      emit Deposit(token, from, tokens, balances[token][from]);

      return true;
  }


  //No approve needed, only from msg.sender
  function withdrawTokens(address token, uint256 tokens) public returns (bool success){
     balances[token][msg.sender] = balances[token][msg.sender].sub(tokens);

     require(ERC20Interface(token).transfer(msg.sender, tokens));


     emit Withdraw(token, msg.sender, tokens, balances[token][msg.sender]);
     return true;
}


  function receiveApproval(address from, uint256 tokens, address token, bytes data) public returns (bool success) { 

       return depositTokens(from, token, tokens );

}
 

  
 



}
