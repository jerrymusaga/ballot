import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToByte32(array: string[]) {
    let byteArray = [];

    for(let i = 0; i < array.length; i++){  
        byteArray.push(ethers.utils.formatBytes32String(array[i]));
    } 
    return byteArray;
}


async function main(){

    const args = process.argv;
    const proposals = args.splice(2);

    if(proposals.length <= 0) throw new Error("Need one or more arguments");

    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY) ;
    console.log({provider})

    //use existing wallet using private key
    const private_key = process.env.PRIVATE_KEY ;
    if(!private_key || private_key.length == 0) throw new Error("Missing environment: private key");
    const wallet = new ethers.Wallet(private_key);
    console.log(`wallet account address is: ${wallet.address}`);
    const signer = wallet.connect(provider);
    const signerBalance = await signer.getBalance();
    console.log(`Balance of signer is ${signerBalance} wei`)

    
    /*
    //use existing wallet using mnemonic keys
    const mnemonic = process.env.MNEMONIC ;
    if (!mnemonic || mnemonic.length == 0) throw new Error("Missing Environment: mnemonics");
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    console.log(`wallet account address is: ${wallet.address}`);
    const signer = wallet.connect(provider);
    const signerBalance = await signer.getBalance();
    console.log(`Balance of signer is ${signerBalance} wei`)
    */
  
    /* 
    //create a new random wallet
    const wallet = ethers.Wallet.createRandom();
    console.log(`wallet account address is: ${wallet.address}`);
    const signer = wallet.connect(provider);
    const signerBalance = await signer.getBalance();
    console.log(`Balance of signer is ${signerBalance} wei`);
    */

    

    console.log("Deploying Ballot Contract");
    console.log("Proposals")
    proposals.forEach((element, index) => {
        console.log(`Proposal Index ${index + 1}: ${element}`);
    })

    const ballotContractFactory = new Ballot__factory(signer);
    console.log("Deploying contract...")
    const ballotContract = await ballotContractFactory.deploy(convertStringArrayToByte32(PROPOSALS));
    const deployTxnReceipt = await ballotContract.deployTransaction.wait();
    console.log(`ballot deployed to address: ${ballotContract.address}` )
    console.log({deployTxnReceipt})


    
}

main().catch((error)=>{
    console.error(error);
    process.exitCode = 1;
})