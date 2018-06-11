
 ## Lava Wallet

  Deposit tokens in this smart contract in order to allow other users to withdraw them with offchain digital signatures


 #### Background

  Many Dapps smart contracts incorporate their own 'balances[]' mapping within in order to keep track of how many tokens it 'owes' each account and these contracts store tokens used for the Dapp within the contract itself.  For example, ForkDelta and EtherDelta and many more.  The problem is, every user who wants to use these Dapps has to make an onchain transaction to deposit their tokens into the Dapp, perform the action within the Dapp, and then withdraw their tokens with another onchain transaction.  This is a lot of onchain overhead including gas fees and storing data in the blockchain and it is not necessary if offchain-transactions /ECRecovery signatures could be used.

 Unfortunately, typical ERC20 tokens do not have their own methods for approvals or transfers based on ECRecovery signatures.  However, they do IF they are deposited in the LavaWallet smart contract.  Therefore, this future concept includes a scenario where users store their tokens in the LavaWallet smart contract which allows for onchain deposits/withdraws at any time with no fees besides gas.  Then, offchain signatures can be created using Metamask and other software which will approve Dapp Smartcontracts (or other third parties) to withdraw/transfer out tokens stored in the LavaWallet on behalf of the users.  This of course requires an ECsignature from that particular user.  

 In this way, if multiple Dapps all supported using offchain signature transfers to/from the LavaWallet, those Dapps would not need to keep store any tokens within themselves, they would not need to track token balances[] for users, and the users would be able to easily offchain approve their tokens for those Dapps to utilize.  That way, all of those Dapps would effectively share the same balances[] mapping.. they would all share the same Smart Contract wallet.  


### Usecases

1. Pool sends tokens here.  Pays people using offchain codes which they redeem

2. Traders keep tokens here.  Perform offchain trades using a separate DEX contract


### Testing
1. run 'ganache-cli' in another terminal
2. copy account address and pkey into the /test file LavaWallet.js
3. 'npm run test'



TO VERIFY:
1. Had to flatten so libs were inside the one file  
2. Deploy using Remix, it actually deployed two contracts (ecrecovery and lavawallet)
3. Verified ecrecovery by itself
4. Used the new Beta validator with the FULL flat file, point at the ecrecovery lib by address as well



### Published on Ropsten (old)
ECRecover
0x9add22cd7e6567d7ff979f3d1f77f5b949124792

LavaWallet
0x1d0d66272025d7c59c40257813fc0d7ddf2c4826



### Published on MainNet
ECRecover
 0x61388904afac03beb15173340dfe3e634fcd7c16

LavaWallet
0x2f9cc1042d889353caf2e346b63ccfec985ae515




old versions :
https://ropsten.etherscan.io/address/0xfe2e08786568e91a128ae0f15e0d9d48f19f67d2
