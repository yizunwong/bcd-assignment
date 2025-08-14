/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';
import { InsuranceContract } from '../../../blockchain/typechain-types/contracts/InsuranceContract';
import { InsuranceContract__factory } from '../../../blockchain/typechain-types/factories/contracts/InsuranceContract__factory';

@Injectable()
export class PolicySchedulerService {
  private readonly logger = new Logger(PolicySchedulerService.name);

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

  @Cron(CronExpression.EVERY_HOUR)
  async handleLapsedPolicies() {
    this.logger.log('Checking for overdue policies...');

    const now = new Date().toISOString();
    const { data: overdueCoverage, error } = await this.supabase
      .from('coverage')
      .select('id')
      .eq('status', 'active')
      .lt('next_payment_date', now); // overdue

    if (error) {
      this.logger.error('Error fetching overdue policies', error);
      return;
    }

    for (const coverage of overdueCoverage || []) {
      try {
        const tx: ethers.ContractTransactionResponse =
          await this.contract.checkAndLapseCoverage(coverage.id);
        await tx.wait();

        this.logger.log(`Coverage ${coverage.id} lapsed successfully`);
      } catch (err) {
        this.logger.error(`Error lapsing coverage ${coverage.id}`, err);
      }
    }
  }
}
