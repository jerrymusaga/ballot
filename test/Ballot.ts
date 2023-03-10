import { expect } from "chai";
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
        
        for (let i = 0; i < PROPOSALS.length; i++){
            const proposals = await ballotContract.proposals(i);
            expect(ethers.utils.parseBytes32String(proposals.name)).to.eq(PROPOSALS[i]);
        }
        

    })

    it("assigns chairman to be the deployer of contract", async function(){
        const signers = await ethers.getSigners();
        const signer = signers[0].address;
        const deployer = await ballotContract.chairperson();
        expect(signer).to.eq(deployer)
    })

    it("has zero vote count for each proposal", async function (){
        for (let i = 0; i < PROPOSALS.length; i++){
            const proposals = await ballotContract.proposals(i);
            expect(proposals.voteCount).to.eq(0);
        }
    })

    it("expect chairperson weight to be 1", async function (){
        const chairperson = await ballotContract.chairperson();
        const chairpersonVoter = await ballotContract.voters(chairperson);
        const weight = chairpersonVoter.weight;
        expect(weight).to.eq(1);
    })


})