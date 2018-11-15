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

This is a King Of The Hill Aurhority contract which requires Proof of Stake to set the king
 

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
 

contract RelayAuthorityInterface {
    function getRelayAuthority() view public returns (address);
}


contract StakingDelegate is  RelayAuthorityInterface {


    using SafeMath for uint;
  
  

   //There are slots, can overwrite one by staking enough tokens
   public address[] stakers;
   public address[] stakerAuthorities;
   public uint[] amountStaked; 
   
   public uint[] stakingLockBlock; //The block at which the staker is allowed to withdraw their stake 
   
   public uint numberOfStakers = 15;  //A constant 

   public mapping(address => uint) balances;


  
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
    require( amountStaked[stakerIndex].mul(1.05) < tokens );
    require( stakerIndex < numberOfStakers );
    require( stakers[stakerIndex] != msg.sender );
    require( getEpochNumber() > stakingLockBlock[stakerIndex]); 
    
    stakingLockBlock[stakerIndex] = getEpochNumber() + 100;
    
    address originalStaker = stakers[stakerIndex];
    uint originalAmountStaked = amountStaked[stakerIndex];
    address originalAuthority = stakerAuthorities[stakerIndex];
    
     
    balances[msg.sender] = balances[msg.sender].sub(tokens);
    amountStaked[stakerIndex] = amountStaked[msg.sender].add(tokens);
    stakers[stakerIndex] = msg.sender;
    stakerAuthorities[stakerIndex] = authority;
    
    if(originalAmountStaked>0)
    {
      balances[originalStaker] = balances[originalStaker].add(originalAmountStaked);
    }

    return true;
  }

  function stopStaking(uint stakerIndex)
  {
    require( amountStaked[stakerIndex] >= tokens );
    require( stakers[stakerIndex] == msg.sender );
    require( stakerIndex < numberOfStakers );    
    require( getEpochNumber() > stakingLockBlock[stakerIndex]); 
  
    uint originalAmountStaked = amountStaked[stakerIndex];
    
    amountStaked[stakerIndex] = 0;
    stakers[stakerIndex] = 0x0;
    stakerAuthorities[stakerIndex] = 0x0;
    balances[msg.sender] = balances[msg.sender].add(originalAmountStaked);    

    return true;
  }


  /*
  Rotate through the staker authorities 
  */
  function getRelayAuthority() view public returns (address king)
  {    
    uint stakerIndex = getEpochNumber() % numberOfStakers;

    return stakerAuthorities[stakerIndex];
  }
  
  
  function isSlotOpen(uint stakerIndex) view public returns (uint count)
  {
    return ( getEpochNumber() > stakingLockBlock[stakerIndex] ); 
  }
  
  function getEpochNumber() view public returns (uint count)
  {
    return  ERC918Interface(minedToken).epochCount;
  }



function depositTokens(address from,  uint256 tokens ) public returns (bool success)
  {
      //we already have approval so lets do a transferFrom - transfer the tokens into this contract

      require(ERC20Interface(minedToken).transferFrom(from, this, tokens));

      balances[token][from] = balances[minedToken][from].add(tokens);
   
      emit Deposit(token, from, tokens, balances[minedToken][from]);

      return true;
  }


  //No approve needed, only from msg.sender
  function withdrawTokens(  uint256 tokens) public returns (bool success){
     balances[minedToken][msg.sender] = balances[minedToken][msg.sender].sub(tokens);

     require(ERC20Interface(minedToken).transfer(msg.sender, tokens));


     emit Withdraw(token, msg.sender, tokens, balances[minedToken][msg.sender]);
     return true;
}


  function receiveApproval(address from, uint256 tokens, address token, bytes data) public returns (bool success) { 
       require(token == minedToken);
        
       return depositTokens(from,   tokens );

}
 

  
 



}
