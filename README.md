
 ## Lava Wallet

  Deposit tokens in this smart contract in order to allow other users to withdraw them with offchain digital signatures


 #### Background

  Many Dapps smart contracts incorporate their own 'balances[]' mapping within in order to keep track of how many tokens it 'owes' each account and these contracts store tokens used for the Dapp within the contract itself.  For example, ForkDelta and EtherDelta and many more.  The problem is, every user who wants to use these Dapps has to make an onchain transaction to deposit their tokens into the Dapp, perform the action within the Dapp, and then withdraw their tokens with another onchain transaction.  This is a lot of onchain overhead including gas fees and storing data in the blockchain and it is not necessary if offchain-transactions /ECRecovery signatures could be used.

 Unfortunately, typical ERC20 tokens do not have their own methods for approvals or transfers based on ECRecovery signatures.  However, they do IF they are deposited in the LavaWallet smart contract.  Therefore, this future concept includes a scenario where users store their tokens in the LavaWallet smart contract which allows for onchain deposits/withdraws at any time with no fees besides gas.  Then, offchain signatures can be created using Metamask and other software which will approve Dapp Smartcontracts (or other third parties) to withdraw/transfer out tokens stored in the LavaWallet on behalf of the users.  This of course requires an ECsignature from that particular user.  

 In this way, if multiple Dapps all supported using offchain signature transfers to/from the LavaWallet, those Dapps would not need to keep store any tokens within themselves, they would not need to track token balances[] for users, and the users would be able to easily offchain approve their tokens for those Dapps to utilize.  That way, all of those Dapps would effectively share the same balances[] mapping.. they would all share the same Smart Contract wallet.  


### Usecases

1. Pool sends tokens here.  Pays people using offchain codes which they redeem

2. Traders keep tokens here.  Perform offchain trades using a separate DEX contract



TO VERIFY:
1. Had to flatten so libs were inside the one file  
2. Deploy using Remix, it actually deployed two contracts (ecrecovery and lavawallet)
3. Verified ecrecovery by itself
4. Used the new Beta validator with the FULL flat file, point at the ecrecovery lib by address as well



### Published on Ropsten
ECRecover
0xd795e019bfba8e0549cc748e24e403c01d0b6ec5

LavaWallet
  0xbe6076332be098e8552c78aeee467445c1e0d90d



old versions :
https://ropsten.etherscan.io/address/0xfe2e08786568e91a128ae0f15e0d9d48f19f67d2
