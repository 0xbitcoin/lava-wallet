
 ## Lava Wallet

 #### Deposit tokens in this smart contract in order to allow smart contracts (and other users) to directly spend them with offchain digital signatures (without on chain approve() calls)



Deployed on ropsten :
https://ropsten.etherscan.io/tx/0x9bf92a1b8010787b6af093b64443e432ca84750c8d1aa3b7f7b1e8ca17263c45


TO VERIFY:
1. Had to flatten so libs were inside the one file  
2. Deploy using Remix, it actually deployed two contracts (ecrecovery and lavawallet)
3. Verified ecrecovery by itself
4. Used the new Beta validator with the FULL flat file, point at the ecrecovery lib by address as well 



safemath lib ropsten:  0xf921b95ac43dcf0ad1f5f85406705328aa10d516


ecrecovery lib ropsten: 0xd8a794aeb5264f5c7d9b37cba0163df5aa0c2ad1



old versions :
https://ropsten.etherscan.io/address/0xfe2e08786568e91a128ae0f15e0d9d48f19f67d2
