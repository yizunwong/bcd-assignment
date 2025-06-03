import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import contractJson from '../../../../blockchain/artifacts/contracts/LoanContract.sol/LoanContract.json';
import { LoanContract } from '../../../../blockchain/typechain-types';
import contractAddressJson from '../../../../blockchain/contract-address.json';

const CONTRACT_ADDRESS = contractAddressJson.address;
const RPC_URL = 'http://127.0.0.1:8545';
const PRIVATE_KEY =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

@Injectable()
export class LoanService {
  private contract: LoanContract | null = null;

  private getContract(): LoanContract {
    if (!this.contract) {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const signer = new ethers.Wallet(PRIVATE_KEY, provider);
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractJson.abi,
        signer,
      ) as unknown as LoanContract;
    }
    return this.contract;
  }

  async createLoan(amount: number) {
    const contract = this.getContract();
    const tx = await contract.createLoan(amount);
    await tx.wait();
    return { message: 'Loan created on blockchain' };
  }

  async repayLoan(id: number) {
    const contract = this.getContract();
    const tx = await contract.repayLoan(id);
    await tx.wait();
    return { message: `Loan ${id} repaid` };
  }

  async getLoan(id: number) {
    const contract = this.getContract();
    const loan = await contract.getLoan(id);

    // Convert all BigInts to strings
    const parsedLoan = {
      id: loan.id.toString(),
      amount: loan.amount.toString(),
      borrower: loan.borrower,
      repaid: loan.repaid,
    };

    console.log(parsedLoan);
    return parsedLoan;
  }
}
