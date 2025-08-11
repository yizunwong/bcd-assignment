import { expect } from 'chai';
import { ethers } from 'hardhat';
import { InsuranceContract } from '../typechain-types';
import type { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('InsuranceContract', function () {
  let insuranceContract: InsuranceContract;
  let owner: SignerWithAddress;
  let policyholder: SignerWithAddress;
  let otherAccount: SignerWithAddress;

  const coverage = ethers.parseEther('10');
  const premium = ethers.parseEther('0.1');
  const durationDays = 365;
  const agreementCid = 'sample-cid';

  beforeEach(async function () {
    [owner, policyholder, otherAccount] = await ethers.getSigners();

    const InsuranceContractFactory = await ethers.getContractFactory('InsuranceContract');
    insuranceContract = await InsuranceContractFactory.deploy();
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await insuranceContract.owner()).to.equal(owner.address);
    });
  });

  describe('Policy Creation', function () {
    it('Should create a policy with agreement CID', async function () {
      const tx = await insuranceContract
        .connect(policyholder)
        .createPolicyWithPayment(coverage, premium, durationDays, agreementCid, { value: premium });
      await tx.wait();

      const policy = await insuranceContract.getPolicy(0);
      expect(policy.policyholder).to.equal(policyholder.address);
      expect(policy.coverage).to.equal(coverage);
      expect(policy.premium).to.equal(premium);
      expect(policy.agreementCid).to.equal(agreementCid);
      expect(policy.status).to.equal(0);
    });

    it('Should fail if coverage is zero', async function () {
      await expect(
        insuranceContract
          .connect(policyholder)
          .createPolicyWithPayment(0, premium, durationDays, agreementCid, { value: premium })
      ).to.be.revertedWith('Coverage must be greater than 0');
    });

    it('Should fail if premium is zero', async function () {
      await expect(
        insuranceContract
          .connect(policyholder)
          .createPolicyWithPayment(coverage, 0, durationDays, agreementCid, { value: 0 })
      ).to.be.revertedWith('Premium must be greater than 0');
    });

    it('Should fail if agreement CID is empty', async function () {
      await expect(
        insuranceContract
          .connect(policyholder)
          .createPolicyWithPayment(coverage, premium, durationDays, '', { value: premium })
      ).to.be.revertedWith('Agreement CID required');
    });
  });

  describe('Premium Payments', function () {
    beforeEach(async function () {
      await insuranceContract
        .connect(policyholder)
        .createPolicyWithPayment(coverage, premium, durationDays, agreementCid, { value: premium });
    });

    it('Should allow policyholder to pay premium', async function () {
      await ethers.provider.send('evm_increaseTime', [31 * 24 * 60 * 60]);
      await ethers.provider.send('evm_mine', []);
      const tx = await insuranceContract.connect(policyholder).payPremium(0, { value: premium });
      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);
    });

    it('Should fail if not policyholder', async function () {
      await ethers.provider.send('evm_increaseTime', [31 * 24 * 60 * 60]);
      await ethers.provider.send('evm_mine', []);
      await expect(
        insuranceContract.connect(otherAccount).payPremium(0, { value: premium })
      ).to.be.revertedWith('Not policyholder');
    });
  });

  describe('Claim Filing', function () {
    beforeEach(async function () {
      await insuranceContract
        .connect(policyholder)
        .createPolicyWithPayment(coverage, premium, durationDays, agreementCid, { value: premium });
    });

    it('Should allow policyholder to file claim', async function () {
      const claimAmount = ethers.parseEther('1');
      const tx = await insuranceContract
        .connect(policyholder)
        .fileClaim(0, claimAmount, 'Accident');
      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);
    });

    it('Should fail if not policyholder', async function () {
      const claimAmount = ethers.parseEther('1');
      await expect(
        insuranceContract.connect(otherAccount).fileClaim(0, claimAmount, 'Accident')
      ).to.be.revertedWith('Not policyholder');
    });

    it('Should fail if claim amount exceeds coverage', async function () {
      const claimAmount = ethers.parseEther('15');
      await expect(
        insuranceContract.connect(policyholder).fileClaim(0, claimAmount, 'Accident')
      ).to.be.revertedWith('Claim amount exceeds coverage');
    });

    it('Should fail if claim amount is zero', async function () {
      await expect(
        insuranceContract.connect(policyholder).fileClaim(0, 0, 'Accident')
      ).to.be.revertedWith('Claim amount must be greater than 0');
    });
  });

  describe('Claim Approval', function () {
    beforeEach(async function () {
      await insuranceContract
        .connect(policyholder)
        .createPolicyWithPayment(coverage, premium, durationDays, agreementCid, { value: premium });
      const claimAmount = ethers.parseEther('1');
      await insuranceContract.connect(policyholder).fileClaim(0, claimAmount, 'Accident');
    });

    it('Should allow owner to approve claim', async function () {
      const initialBalance = await ethers.provider.getBalance(policyholder.address);
      const tx = await insuranceContract.connect(owner).approveClaim(0);
      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);
      const finalBalance = await ethers.provider.getBalance(policyholder.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it('Should fail if not owner', async function () {
      await expect(
        insuranceContract.connect(policyholder).approveClaim(0)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should fail if claim already approved', async function () {
      await insuranceContract.connect(owner).approveClaim(0);
      await expect(
        insuranceContract.connect(owner).approveClaim(0)
      ).to.be.revertedWith('Already approved');
    });
  });

  describe('Policy Management', function () {
    beforeEach(async function () {
      await insuranceContract
        .connect(policyholder)
        .createPolicyWithPayment(coverage, premium, durationDays, agreementCid, { value: premium });
    });

    it('Should return policy details', async function () {
      const policy = await insuranceContract.getPolicy(0);
      expect(policy.policyholder).to.equal(policyholder.address);
      expect(policy.coverage).to.equal(coverage);
      expect(policy.premium).to.equal(premium);
      expect(policy.agreementCid).to.equal(agreementCid);
    });
  });
});

