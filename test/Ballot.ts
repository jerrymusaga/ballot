import { ethers } from "hardhat"
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToByte32(array: string[]) {
    let byteArray = [];

    for(let i = 0; i < array.length; i++){  
        byteArray.push(ethers.utils.formatBytes32String(array[i]));
    } 
    return byteArray;
}


describe("Ballot", function (){

    let ballotContract: Ballot;

    beforeEach(async function (){
        const ballotContractFactory = await ethers.getContractFactory("Ballot");
        ballotContract = await ballotContractFactory.deploy(convertStringArrayToByte32(PROPOSALS));
        await ballotContract.deployTransaction.wait();
        console.log(`ballot deployed to address: ${ballotContract.address}` )
    })

    it("has all the provided proposals", async function () {

    })

    it("assigns chairman to be the deployer of contract", async function(){

    })


})