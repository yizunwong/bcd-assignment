import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';
import { InsuranceContract } from '../../../../blockchain/typechain-types/contracts/InsuranceContract';
import { InsuranceContract__factory } from '../../../../blockchain/typechain-types/factories/contracts/InsuranceContract__factory';

@Injectable()
export class ClaimBlockchainListenerService implements OnModuleInit {
  private readonly logger = new Logger(ClaimBlockchainListenerService.name);
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );
  private contract: InsuranceContract;

  constructor() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    this.contract = InsuranceContract__factory.connect(
      process.env.INSURANCE_CONTRACT_ADDRESS!,
      wallet,
    );
  }

  onModuleInit() {
    this.contract.on(
      'ClaimFiled',
      async (
        claimId: ethers.BigNumberish,
        coverageId: ethers.BigNumberish,
        amount: ethers.BigNumberish,
      ) => {
        try {
          const claim = await this.contract.getClaim(claimId);
          const cid = claim.description;
          await this.supabase
            .from('claims')
            .upsert(
              {
                id: Number(claimId),
                coverage_id: Number(coverageId),
                amount: Number(amount),
                description: cid,
              },
              { onConflict: 'id' },
            );
          this.logger.log(`Synced claim ${claimId.toString()} from chain`);
        } catch (err) {
          this.logger.error('Failed to upsert claim from chain', err as Error);
        }
      },
    );
  }
}

