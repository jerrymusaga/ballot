import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";


async function main(){

    const arg = process.argv;
    const contractAddress = arg.splice(2,3)?.[0];
    console.log(contractAddress)

    if(!contractAddress || contractAddress.length <=0) throw new Error("missing parameter: contract Address");
    
    const voter = arg.splice(2,3)?.[1];
    console.log(voter)
    if(voter.length <= 0) throw new Error("missing voter address");

    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
    const private_key = process.env.PRIVATE_KEY;
    if(!private_key || private_key.length == 0) throw new Error("Missing environment: private key");
    const wallet = new ethers.Wallet(private_key);
    const signer = wallet.connect(provider);

    const contractFactory = new Ballot__factory(signer);
    const contract = await contractFactory.attach(contractAddress);
    console.log(`attached to address ${contract.address}`)
    await contract.giveRightToVote(voter)
    console.log({contract})
}

main().catch((err) => {
    console.error(err);
    process.exitCode=1;
} )