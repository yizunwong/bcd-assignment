import { expect } from 'chai';
import { ethers } from 'hardhat';
import type { CoverlyToken, InsuranceContract } from '../typechain-types';
import type { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('InsuranceContract with CoverlyToken', function () {
  let token: CoverlyToken;
  let insurance: InsuranceContract;
  let owner: SignerWithAddress;
  let policyholder: SignerWithAddress;

  const coverage = ethers.parseUnits('100', 18);
  const premium = ethers.parseUnits('10', 18);

  beforeEach(async function () {
    [owner, policyholder] = await ethers.getSigners();

    const Token = await ethers.getContractFactory('CoverlyToken');
    token = await Token.deploy();

    const Insurance = await ethers.getContractFactory('InsuranceContract');
    insurance = await Insurance.deploy(await token.getAddress());

    // Fund policyholder and approve contract to spend tokens
    await token.transfer(policyholder.address, premium * 2n);
    await token
      .connect(policyholder)
      .approve(await insurance.getAddress(), premium * 2n);
  });

  it('creates coverage with token payment', async function () {
    const tx = await insurance
      .connect(policyholder)
      .createCoverageWithTokenPayment(
        coverage,
        premium,
        30,
        'cid',
        'name',
        'category',
        'provider'
      );
    await tx.wait();

    const cov = await insurance.getCoverage(1);
    expect(cov.policyholder).to.equal(policyholder.address);
    expect(cov.premium).to.equal(premium);
  });

  it('allows paying premium with tokens', async function () {
    await insurance
      .connect(policyholder)
      .createCoverageWithTokenPayment(
        coverage,
        premium,
        30,
        'cid',
        'name',
        'category',
        'provider'
      );

    const tx = await insurance.connect(policyholder).payPremium(1);
    await tx.wait();

    const payments = await insurance.getCoveragePayments(1);
    expect(payments.length).to.equal(2); // initial + second payment
  });

  it('pays out claims in tokens', async function () {
    await insurance
      .connect(policyholder)
      .createCoverageWithTokenPayment(
        coverage,
        premium,
        30,
        'cid',
        'name',
        'category',
        'provider'
      );

    await insurance.connect(policyholder).payPremium(1);

    const claimAmount = ethers.parseUnits('5', 18);
    await insurance
      .connect(policyholder)
      .fileClaim(1, claimAmount, 'test');

    const balanceBefore = await token.balanceOf(policyholder.address);
    await insurance.connect(owner).approveClaim(1);
    const balanceAfter = await token.balanceOf(policyholder.address);

    expect(balanceAfter - balanceBefore).to.equal(claimAmount);
  });
});
