
 ## Lava Wallet

 #### Deposit tokens in this smart contract in order to allow smart contracts (and other users) to directly spend them with offchain digital signatures (without on chain approve() calls)

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
0x57b8bf55a05dd481b4f8c5fda9dbaa937799db69

LavaWallet
0x38d5665ec478e0340b46a062071a2694bbc0b451



old versions :
https://ropsten.etherscan.io/address/0xfe2e08786568e91a128ae0f15e0d9d48f19f67d2
