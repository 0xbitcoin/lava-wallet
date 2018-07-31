
var LavaTestUtils = require("./LavaTestUtils");

var ethSigUtil = require('eth-sig-util')

var _0xBitcoinToken = artifacts.require("./_0xBitcoinToken.sol");
var wEthToken = artifacts.require("./WETH9.sol");

var MiningKing = artifacts.require("./MiningKing.sol");

var DoubleKingsReward = artifacts.require("./DoubleKingsReward.sol")

var MintHelper = artifacts.require("./MintHelper.sol");

var LavaWallet = artifacts.require("./LavaWallet.sol");


const ethAbi = require('ethereumjs-abi')
var ethUtil =  require('ethereumjs-util');
var web3utils =  require('web3-utils');

const Tx = require('ethereumjs-tx')
var lavaTestUtils = new LavaTestUtils();

const Web3 = require('web3')
// Instantiate new web3 object pointing toward an Ethereum node.
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

var lavaSignature;

//https://web3js.readthedocs.io/en/1.0/web3-utils.html
//https://medium.com/@valkn0t/3-things-i-learned-this-week-using-solidity-truffle-and-web3-a911c3adc730

//generate with ganache-cli
var test_account= {
    'address': '0xea1bc7d721ec2710cc45a1d7af8485a2ec412a83',
    'privateKey': '1b8b805412db21445325a20c7468bc043fa6f43a8274c2791d1eb8a52065b35b'
}

contract('LavaWallet', function(accounts) {

  var walletContract ;
  var tokenContract;
  var kingContract;
  var mintHelperContract;
  var doubleKingsRewardContract;

    it("can deploy ", async function () {

      console.log( 'deploying wallet' )

         mintHelperContract = await MintHelper.deployed( );
         kingContract = await MiningKing.deployed( );
         doubleKingsRewardContract = await DoubleKingsReward.deployed();

         walletContract = await LavaWallet.deployed();


  }),



    it("find schemahash", async function () {


      var  hardcodedSchemaHash = '0x8fd4f9177556bbc74d0710c8bdda543afd18cc84d92d64b5620d5f1881dceb37' ;

      var  typedParams =  [
        {
          type: 'bytes',
          name: 'method',
          value: 0
        },
         {
           type: 'address',
           name: 'from',
           value: 0
         },
         {
           type: 'address',
           name: 'to',
           value: 0
         },
         {
           type: 'address',
           name: 'walletAddress',
           value: 0
         },
         {
           type: 'address',
           name: 'tokenAddress',
           value: 0
         },
         {
           type: 'uint256',
           name: 'tokenAmount',
           value: 0
         },
         {
           type: 'uint256',
           name: 'relayerReward',
           value: 0
         },
         {
           type: 'uint256',
           name: 'expires',
           value: 0
         },
         {
           type: 'uint256',
           name: 'nonce',
           value: 0
         }
       ]




        const error = new Error('Expect argument to be non-empty array')
        if (typeof typedParams !== 'object' || !typedParams.length) throw error

        const data = typedParams.map(function (e) {
          return e.type === 'bytes' ? ethUtil.toBuffer(e.value) : e.value
        })
        const types = typedParams.map(function (e) { return e.type })
        const schema = typedParams.map(function (e) {
          if (!e.name) throw error
          return e.type + ' ' + e.name
        })



      console.log('schema',new Array(typedParams.length).fill('string'),schema)
        console.log('schema subhash',ethAbi.soliditySHA3(new Array(typedParams.length).fill('string'), schema).toString('hex'))

        console.log('types',types, data)
        console.log('types subhash',ethAbi.soliditySHA3(types, data).toString('hex'))


        var hash = '0x'+ethAbi.soliditySHA3(new Array(typedParams.length).fill('string'), schema).toString('hex') ;

        console.log("hash1", ethAbi.soliditySHA3(
          ['bytes32', 'bytes32'],
          [
            ethAbi.soliditySHA3(new Array(typedParams.length).fill('string'), schema),
            ethAbi.soliditySHA3(types, data)
          ]
        ))

        //need to hardcode the 0x64fcd ... into solidity !!
        console.log("hash2", ethAbi.soliditySHA3(
          ['bytes32', 'bytes32'],
          [
            '0x313236b6cd8d12125421e44528d8f5ba070a781aeac3e5ae45e314b818734ec3',
            ethAbi.soliditySHA3(types, data)
          ]
        ))


        /*return ethAbi.soliditySHA3(
          ['bytes32', 'bytes32'],
          [
            ethAbi.soliditySHA3(new Array(typedParams.length).fill('string'), schema),
            ethAbi.soliditySHA3(types, data)
          ]
        )*/




        assert.equal(hash,hardcodedSchemaHash )
    });


  it("can mint tokens", async function () {


   tokenContract = await _0xBitcoinToken.deployed();


    await printBalance(test_account.address,tokenContract)

//canoe

//7.3426930413956622283065143620738574142638959639431768834166324387693517887725e+76)


    console.log('contract')

    console.log(tokenContract.address)


    var challenge_number = await tokenContract.getChallengeNumber.call( );



  //  challenge_number = '0x085078f6e3066836445e800334b4186d99567065512edfe78fa7a4f611d51c3d'

  //   var solution_number = 1185888746
  //  var solution_digest = '0x000016d56489592359ce8e8b61ec335aeb7b7dd5695da22e25ab2039e02c8976'

  //  var sress = '0x2B63dB710e35b0C4261b1Aa4fAe441276bfeb971';



    var targetString = await tokenContract.getMiningTarget.call({from: addressFrom});
    var miningTarget = web3utils.toBN(targetString);

    console.log('target',miningTarget)
      console.log('challenge',challenge_number)

    var addressFrom = mintHelperContract.address;

    console.log("starting to mine for", addressFrom)

    var solution_number;
    var phraseDigest;

    var solution_number_prefix = test_account.address

  while(true)
  {

    var solution_number_suffix = web3utils.randomHex(12)

    if(solution_number_suffix.startsWith('0x'))
    {
      solution_number_suffix= solution_number_suffix.substring(2)
    }

    solution_number = solution_number_prefix.concat(solution_number_suffix)


    phraseDigest = web3utils.soliditySha3(challenge_number, addressFrom, solution_number )

    var digestBytes32 = web3utils.hexToBytes(phraseDigest)
    var digestBigNumber = web3utils.toBN(phraseDigest)


    if ( digestBigNumber.lt(miningTarget)   )
    {
      console.log("found a good solution nonce!", solution_number);

      break;
    }
  }

  console.log('phraseDigest', phraseDigest);  // 0x0007e4c9ad0890ee34f6d98852d24ce6e9cc6ecfad8f2bd39b7c87b05e8e050b

  console.log(solution_number)

   await mintHelperContract.setMinterWallet(test_account.address)
    await mintHelperContract.setPayoutsWallet(test_account.address)

  var checkDigest = await tokenContract.getMintDigest.call(solution_number,phraseDigest,challenge_number, {from: addressFrom});

  console.log('checkDigest',checkDigest)

  console.log('target',miningTarget)

  console.log('challenge_number',challenge_number)

 //  await submitMintingSolution(tokenContract, solution_number,phraseDigest,test_account);

   await submitMintingSolutionToForwarder(kingContract, doubleKingsRewardContract, mintHelperContract, solution_number,phraseDigest,test_account);
  //await submitMintingSolutionToProxy( mintHelperContract, solution_number,phraseDigest,test_account);


  await printBalance(test_account.address,tokenContract)

  var king = await kingContract.getKing.call()
  console.log('king is ', king )

   assert.equal(king, test_account.address ); //initialized

});


it("can deposit 0xbtc into lava wallet", async function () {


    await printBalance(test_account.address,tokenContract)

    //console.log('tokenContract',tokenContract)
    //console.log('walletContract',walletContract)

//  console.log(tokenContract.address)

    var _0xBitcoinABI = require('../javascript/abi/_0xBitcoinToken.json');
    var LavaWalletABI = require('../javascript/abi/LavaWallet.json');




      var addressFrom = test_account.address;

      var depositAmount = 5000000;

      //??
      var remoteCallData = '0x01';

      var txData = web3.eth.abi.encodeFunctionCall({
              name: 'approveAndCall',
              type: 'function',
              inputs: [
                {
                  "name": "spender",
                  "type": "address"
                },
                {
                  "name": "tokens",
                  "type": "uint256"
                },
                {
                  "name": "data",
                  "type": "bytes"
                }],
                outputs: [
                  {
                    "name": "success",
                    "type": "bool"
                  }
              ]
          }, [walletContract.address, depositAmount, remoteCallData]);


          try{
            var txCount = await web3.eth.getTransactionCount(addressFrom);
            console.log('txCount',txCount)
           } catch(error) {  //here goes if someAsyncPromise() rejected}
            console.log(error);

             return error;    //this will result in a resolved promise.
           }

           var addressTo = tokenContract.address;
           var privateKey = test_account.privateKey;

          const txOptions = {
            nonce: web3utils.toHex(txCount),
            gas: web3utils.toHex("1704624"),
            gasPrice: web3utils.toHex(web3utils.toWei("4", 'gwei') ),
            value: 0,
            to: addressTo,
            from: addressFrom,
            data: txData
          }



        var sentDeposit = await new Promise(function (result,error) {

              sendSignedRawTransaction(web3,txOptions,addressFrom,privateKey, function(err, res) {
              if (err) error(err)
                result(res)
            })

          }.bind(this));


           console.log(sentDeposit)

            var checkDeposit  = await walletContract.balanceOf.call(tokenContract.address,addressFrom, {from: addressFrom});

            var accountBalance = await getBalance(walletContract.address,tokenContract)
            assert.equal(accountBalance.token, 5000000 );

            assert.equal(checkDeposit.toNumber(), 5000000 );


            //not working
            console.log('checkDeposit ',checkDeposit.toNumber())

            await printBalance(test_account.address,tokenContract)


            console.log(walletContract.address)
            await printBalance(walletContract.address,tokenContract)

});






it("can approveTokensWithSignature ", async function () {


    await printBalance(test_account.address,tokenContract)



    var addressFrom = test_account.address;

    console.log( addressFrom )

    //var msg = '0x8CbaC5e4d803bE2A3A5cd3DbE7174504c6DD0c1C'
    var requestRecipient = test_account.address;
    var requestQuantity = 500;


     var requestToken = tokenContract.address;

     var requestNonce = web3utils.randomHex(32);

     var privateKey = test_account.privateKey;

     var from= addressFrom;
     var to= "0x357FfaDBdBEe756aA686Ef6843DA359E2a85229c"
     var walletAddress=walletContract.address
     var tokenAddress=tokenContract.address
     var tokenAmount=2000000
     var relayerReward=1000000
     var expires=336504400
     var nonce='0xc18f687c56f1b2749af7d6151fa351'
     //var expectedSignature="0x8ef27391a81f77244bf95df58737eecac386ab9a47acd21bdb63757adf71ddf878169c18e4ab7b71d60f333c870258a0644ac7ade789d59c53b0ab75dbcc87d11b"


     var params = lavaTestUtils.getLavaParamsFromData('approve',from,to,walletAddress,tokenAddress,tokenAmount,relayerReward,expires,nonce)


  //need to format the   params properly


    var msgParams = {data: params}

    var privKey = Buffer.from(privateKey, 'hex')



   const msgHash = ethSigUtil.typedSignatureHash(msgParams.data)

    ///msg hash signed is 0x9201073a01df85b87dab83ad2498bf5b2190bf62cb03b2a407ba7d77279a4ceb
    var lavaMsgHash = await walletContract.getLavaTypedDataHash.call('approve',from,to,tokenAddress,tokenAmount,relayerReward,expires,nonce )
    console.log('lavaMsgHash',lavaMsgHash)

    assert.equal(lavaMsgHash, msgHash ); //initialized


    var signature = lavaTestUtils.signTypedData(privKey,msgParams);



    lavaSignature = signature;
    console.log('lava signatureaa',msgParams,signature)

    msgParams.sig = signature;



    var recoveredAddress = lavaTestUtils.recoverTypedSignature(msgParams);

    assert.equal(recoveredAddress, test_account.address ); //initialized





    var result = await walletContract.getLavaTypedDataHash.call('approve',from,to,tokenAddress,tokenAmount,relayerReward,expires,nonce )

    console.log('result1', result )


    console.log('addressFrom',addressFrom)
    console.log('meeep',[from,to,tokenAddress,tokenAmount,relayerReward,expires,nonce,signature])



  //  var result = await walletContract.approveTokensWithSignature.call(from,to,tokenAddress,tokenAmount,relayerReward,expires,nonce )



    var txData = web3.eth.abi.encodeFunctionCall({
            name: 'approveTokensWithSignature',
            type: 'function',
            inputs: [
              {
                "name": "from",
                "type": "address"
              },
              {
                "name": "to",
                "type": "address"
              },
              {
                "name": "token",
                "type": "address"
              },
              {
                "name": "tokens",
                "type": "uint256"
              },
              {
                "name": "relayerReward",
                "type": "uint256"
              },
              {
                "name": "expires",
                "type": "uint256"
              },
              {
                "name": "nonce",
                "type": "uint256"
              },
              {
                "name": "signature",
                "type": "bytes"
              }
            ],
              outputs: [
                {
                  "name": "success",
                  "type": "bool"
                }
            ]
        }, [from,to,tokenAddress,tokenAmount,relayerReward,expires,nonce,signature]);


      try{
          var txCount = await web3.eth.getTransactionCount(addressFrom);
          console.log('txCount',txCount)
         } catch(error) {  //here goes if someAsyncPromise() rejected}
          console.log(error);

           return error;    //this will result in a resolved promise.
         }

         var addressTo = walletContract.address;
         var privateKey = test_account.privateKey;

        const txOptions = {
          nonce: web3utils.toHex(txCount),
          gas: web3utils.toHex("1704624"),
          gasPrice: web3utils.toHex(web3utils.toWei("4", 'gwei') ),
          value: 0,
          to: addressTo,
          from: addressFrom,
          data: txData
        }



      var txhash = await new Promise(function (result,error) {

            sendSignedRawTransaction(web3,txOptions,addressFrom,privateKey, function(err, res) {
            if (err) error(err)
              result(res)
          })

        }.bind(this));



        assert.ok(txhash)

        var burnStatus = await walletContract.signatureBurnStatus.call(msgHash )

        assert.equal( burnStatus.toNumber() , 0x1); //initialized

  });



  it("can burn a signature", async function () {


    var addressFrom = test_account.address;
    var privateKey= test_account.privateKey;


    var from= addressFrom;
    var to= "0x357FfaDBdBEe756aA686Ef6843DA359E2a85229c"
    var walletAddress=walletContract.address
    var tokenAddress=tokenContract.address
    var tokenAmount=2000000
    var relayerReward=1000000
    var expires=336504400
    var nonce='0xa18f687c56f1b2749af7d6151fa351'  //new nonce
//    var signature= lavaSignature;






        var params = lavaTestUtils.getLavaParamsFromData('approve',from,to,walletAddress,tokenAddress,tokenAmount,relayerReward,expires,nonce)

        var msgParams = {data: params}

        var privKey = Buffer.from(privateKey, 'hex')

        const msgHash = ethSigUtil.typedSignatureHash(msgParams.data)

        ///msg hash signed is 0x9201073a01df85b87dab83ad2498bf5b2190bf62cb03b2a407ba7d77279a4ceb
        var lavaMsgHash = await walletContract.getLavaTypedDataHash.call('approve',from,to,tokenAddress,tokenAmount,relayerReward,expires,nonce )
        console.log('lavaMsgHash',lavaMsgHash)

        assert.equal(lavaMsgHash, msgHash ); //initialized


        var signature = lavaTestUtils.signTypedData(privKey,msgParams);



    var txData = web3.eth.abi.encodeFunctionCall({
            name: 'burnSignature',
            type: 'function',
            inputs: [
              {
                "name": "method",
                "type": "bytes"
              },
              {
                "name": "from",
                "type": "address"
              },
              {
                "name": "to",
                "type": "address"
              },
              {
                "name": "token",
                "type": "address"
              },
              {
                "name": "tokens",
                "type": "uint256"
              },
              {
                "name": "relayerReward",
                "type": "uint256"
              },
              {
                "name": "expires",
                "type": "uint256"
              },
              {
                "name": "nonce",
                "type": "uint256"
              },
              {
                "name": "signature",
                "type": "bytes"
              }
            ],
              outputs: [
                {
                  "name": "success",
                  "type": "bool"
                }
            ]
        }, [web3utils.utf8ToHex('approve'),from,to,tokenAddress,tokenAmount,relayerReward,expires,nonce,signature]);


        try{
          var txCount = await web3.eth.getTransactionCount(addressFrom);
          console.log('txCount',txCount)
         } catch(error) {  //here goes if someAsyncPromise() rejected}
          console.log(error);

           return error;    //this will result in a resolved promise.
         }

         var addressTo = walletContract.address;
         var privateKey = test_account.privateKey;

        const txOptions = {
          nonce: web3utils.toHex(txCount),
          gas: web3utils.toHex("1704624"),
          gasPrice: web3utils.toHex(web3utils.toWei("4", 'gwei') ),
          value: 0,
          to: addressTo,
          from: addressFrom,
          data: txData
        }



      var txhash = await new Promise(function (result,error) {

            sendSignedRawTransaction(web3,txOptions,addressFrom,privateKey, function(err, res) {
            if (err) error(err)
              result(res)
          })

        }.bind(this));


        assert.ok(txhash)

        var burnStatus = await walletContract.signatureBurnStatus.call(msgHash )

        assert.equal( burnStatus.toNumber() , 0x2); //initialized

        var burnStatus = await walletContract.signatureBurnStatus.call('0x0' )

        assert.equal( burnStatus.toNumber() , 0x0); //initialized
});




  it("can wrap Eth Tokens", async function () {


    var addressFrom = test_account.address;

    var addressTo = wEthToken.address;
    var privateKey = test_account.privateKey;


        var txData = web3.eth.abi.encodeFunctionCall({
                name: 'deposit',
                type: 'function',
                inputs: [  ],
                  outputs: [  ]
            }, [ ]);

            try{
              var txCount = await web3.eth.getTransactionCount(addressFrom);
              console.log('txCount',txCount)
             } catch(error) {  //here goes if someAsyncPromise() rejected}
              console.log(error);

               return error;    //this will result in a resolved promise.
             }


            const txOptions = {
              nonce: web3utils.toHex(txCount),
              gas: web3utils.toHex("1704624"),
              gasPrice: web3utils.toHex(web3utils.toWei("4", 'gwei') ),
              value: 1000,
              to: addressTo,
              from: addressFrom,
              data: txData
            }


          var txhash = await new Promise(function (result,error) {

                sendSignedRawTransaction(web3,txOptions,addressFrom,privateKey, function(err, res) {
                if (err) error(err)
                  result(res)
              })

            }.bind(this));


            assert.ok(txhash)

        //    console.log(wEthToken)
        //  var balance =   wEthToken.balanceOf.call(addressFrom)
        //  assert.equal(balance,1000)







  });




/*
  assert.equal(10, good_type_record[4].toNumber() ); //check price

  var typeId =  web3utils.toBN(good_type_record[0] );

  console.log("typeId: " + typeId);

  //var result = contract.claimGood(typeId, {value: web3utils.toWei('1')});

  var ethBalance = await web3.eth.getBalance(test_account.address);
   console.log("Account 0 has " + ethBalance + " Wei");

//console.log( web3utils.toWei('40','ether').toString() );

var result =   await contract.claimGood(  typeId , function(){} ,{ value:web3utils.toWei('0.00001','ether') })

//web3utils.keccak256(typeId + '|' + instanceId)

  var instanceId = 0;
  var token_id = await tokenContract.buildTokenId(typeId,instanceId,function(){})

  var token_record = await tokenContract.tokenOwner(token_id);

    console.log('token record ')
      console.log(token_id)
  console.log(token_record)*/
//  assert.equal(true, result );
//  await contract.claimGood(typeId).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',value: 1000});//,{value: 1000}
//  var token_record = await contract.goods.call(typeId);

//  assert.equal(true, token_record ); //initialized


/*
it("can bid on the market", async function () {

  var tokenContract = await GoodToken.deployed();
  var marketContract = await TokenMarket.deployed();
  var contract = await EtherGoods.deployed();

  await marketContract.setTokenContractAddress(test_account.address,tokenContract);
  await contract.setMarketContractAddress(test_account.address,marketContract);
  await contract.setTokenContractAddress(test_account.address,tokenContract);
  await tokenContract.setMasterContractAddress(test_account.address,contract)





}),




  it("can not get supply while supply all taken", async function () {
      var contract = await EtherGoods.deployed();
      var balance = await contract.balanceOf.call(test_account.address);
      console.log("Pre Balance: " + balance);

      var allAssigned = await contract.allPunksAssigned.call();
      console.log("All assigned: " + allAssigned);
      assert.equal(false, allAssigned, "allAssigned should be false to start.");
      await expectThrow(contract.getPunk(0));
      var balance = await contract.balanceOf.call(test_account.address);
      console.log("Balance after fail: " + balance);
    });



  */
});



async function getBalance (account ,tokenContract)
{
      var balance_eth = await (web3.eth.getBalance(account ));
     var balance_token = await tokenContract.balanceOf.call(account , {from: account });

     return {ether: web3utils.fromWei(balance_eth.toString(), 'ether'), token: balance_token.toNumber() };

 }

 async function printBalance (account ,tokenContract)
 {
       var balance_eth = await (web3.eth.getBalance(account ));
      var balance_token = await tokenContract.balanceOf.call(account , {from: account });

      console.log('acct balance', account, web3utils.fromWei(balance_eth.toString() , 'ether')  , balance_token.toNumber())

  }


 async function submitMintingSolution(tokenContract, nonce,digest, account)
 {

//   console.log('tokenContract',tokenContract);


   var addressTo =  tokenContract.address;
   var addressFrom = account.address;


  try{
    var txCount = await  web3.eth.getTransactionCount(addressFrom);
    console.log('txCount',txCount)
   } catch(error) {  //here goes if someAsyncPromise() rejected}
    console.log(error);
      this.miningLogger.appendToErrorLog(error)
     return error;    //this will result in a resolved promise.
   }




    var txData =  web3.eth.abi.encodeFunctionCall({
            name: 'mint',
            type: 'function',
            inputs: [{
                type: 'uint256',
                name: 'nonce'
            },{
                type: 'bytes32',
                name: 'challenge_digest'
            }]
        }, [nonce, digest]);



    var max_gas_cost = 1704624;

  //  var mintMethod =  tokenContract.mint(nonce,digest);

  //  var estimatedGasCost = await mintMethod.estimateGas({gas: max_gas_cost, from:addressFrom, to: addressTo });

  console.log(tokenContract);

  var estimatedGasCost = 1704623

    console.log('estimatedGasCost',estimatedGasCost);
    console.log('txData',txData);

    console.log('addressFrom',addressFrom);
    console.log('addressTo',addressTo);



    if( estimatedGasCost > max_gas_cost){
      console.log("Gas estimate too high!  Something went wrong ")
      return;
    }


    const txOptions = {
      nonce: web3utils.toHex(txCount),
      gas: web3utils.toHex(estimatedGasCost),   //?
      gasPrice: web3utils.toHex(3),
      value: 0,
      to: addressTo,
      from: addressFrom,
      data: txData
    }



  return new Promise(function (result,error) {

       sendSignedRawTransaction( web3,txOptions,addressFrom,account.privateKey, function(err, res) {
        if (err) error(err)
          result(res)
      })

    }.bind(this));


 }


  async function submitMintingSolutionToProxy( proxyMintContract,  nonce,digest, account)
  {

 //   console.log('tokenContract',tokenContract);


    var addressTo =  proxyMintContract.address;
    var addressFrom = account.address;


   try{
     var txCount = await  web3.eth.getTransactionCount(addressFrom);
     console.log('txCount',txCount)
    } catch(error) {  //here goes if someAsyncPromise() rejected}
     console.log(error);
       this.miningLogger.appendToErrorLog(error)
      return error;    //this will result in a resolved promise.
    }




     var txData =  web3.eth.abi.encodeFunctionCall({
             name: 'proxyMint',
             type: 'function',
             inputs: [{
                 type: 'uint256',
                 name: 'nonce'
             },{
                 type: 'bytes32',
                 name: 'challenge_digest'
             } ]
         }, [nonce, digest ]);



     var max_gas_cost = 1704624;

   //  var mintMethod =  tokenContract.mint(nonce,digest);

   //  var estimatedGasCost = await mintMethod.estimateGas({gas: max_gas_cost, from:addressFrom, to: addressTo });

   console.log(addressTo);

   var estimatedGasCost = 1704623

     console.log('estimatedGasCost',estimatedGasCost);
     console.log('txData',txData);

     console.log('addressFrom',addressFrom);
     console.log('addressTo',addressTo);



     if( estimatedGasCost > max_gas_cost){
       console.log("Gas estimate too high!  Something went wrong ")
       return;
     }


     const txOptions = {
       nonce: web3utils.toHex(txCount),
       gas: web3utils.toHex(estimatedGasCost),   //?
       gasPrice: web3utils.toHex(3),
       value: 0,
       to: addressTo,
       from: addressFrom,
       data: txData
     }



   return new Promise(function (result,error) {

        sendSignedRawTransaction( web3,txOptions,addressFrom,account.privateKey, function(err, res) {
         if (err) error(err)
           result(res)
       })

     }.bind(this));


  }




 async function submitMintingSolutionToForwarder(forwardingContract, doubleKingsRewardContract, proxyMintContract,  nonce,digest, account)
 {

//   console.log('tokenContract',tokenContract);


   var addressTo =  forwardingContract.address;
   var addressFrom = account.address;


  try{
    var txCount = await  web3.eth.getTransactionCount(addressFrom);
    console.log('txCount',txCount)
   } catch(error) {  //here goes if someAsyncPromise() rejected}
    console.log(error);
      this.miningLogger.appendToErrorLog(error)
     return error;    //this will result in a resolved promise.
   }


   var cascadeArray = [
     doubleKingsRewardContract.address,
     proxyMintContract.address
   ];


    var txData =  web3.eth.abi.encodeFunctionCall({
            name: 'mintForwarder',
            type: 'function',
            inputs: [{
                type: 'uint256',
                name: 'nonce'
            },{
                type: 'bytes32',
                name: 'challenge_digest'
            },{
                type: 'address[]',
                name: 'proxyMintArray'
            }]
        }, [nonce, digest,cascadeArray]);



    var max_gas_cost = 1704624;

  //  var mintMethod =  tokenContract.mint(nonce,digest);

  //  var estimatedGasCost = await mintMethod.estimateGas({gas: max_gas_cost, from:addressFrom, to: addressTo });

  console.log(addressTo);

  var estimatedGasCost = 1704623

    console.log('estimatedGasCost',estimatedGasCost);
    console.log('txData',txData);

    console.log('addressFrom',addressFrom);
    console.log('addressTo',addressTo);



    if( estimatedGasCost > max_gas_cost){
      console.log("Gas estimate too high!  Something went wrong ")
      return;
    }


    const txOptions = {
      nonce: web3utils.toHex(txCount),
      gas: web3utils.toHex(estimatedGasCost),   //?
      gasPrice: web3utils.toHex(3),
      value: 0,
      to: addressTo,
      from: addressFrom,
      data: txData
    }



  return new Promise(function (result,error) {

       sendSignedRawTransaction( web3,txOptions,addressFrom,account.privateKey, function(err, res) {
        if (err) error(err)
          result(res)
      })

    }.bind(this));


 }

 async function sendSignedRawTransaction(web3,txOptions,addressFrom,fullPrivKey,callback) {


   var privKey = truncate0xFromString( fullPrivKey )

   const privateKey = new Buffer( privKey, 'hex')
   const transaction = new Tx(txOptions)


   transaction.sign(privateKey)


   const serializedTx = transaction.serialize().toString('hex')

     try
     {
       var result =  web3.eth.sendSignedTransaction('0x' + serializedTx, callback)
     }catch(e)
     {
       console.log(e);
     }
 }


  function truncate0xFromString(s)
 {

   if(s.startsWith('0x')){
     return s.substring(2);
   }
   return s;
 }
