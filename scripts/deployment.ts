import { ethers } from "hardhat";

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

    console.log("Deploying Ballot Contract");
    console.log("Proposals")

    proposals.forEach((element, index) => {
        console.log(`Proposal Index ${index + 1}: ${element}`);
    })

    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    const ballotContract = await ballotContractFactory.deploy(convertStringArrayToByte32(PROPOSALS));
    await ballotContract.deployTransaction.wait();
    console.log(`ballot deployed to address: ${ballotContract.address}` )


    
}

main().catch((error)=>{
    console.error(error);
    process.exitCode = 1;
})