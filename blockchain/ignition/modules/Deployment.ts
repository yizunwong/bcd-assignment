// ignition/modules/Deployment.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FULL_SUPPLY = 100_000n * 10n ** 18n;

export default buildModule("Deployment", (m) => {
  // Deploy Coverly ERC20 token
  const token = m.contract("CoverlyToken");

  // Deploy ICO contract that will sell Coverly tokens
  const ico = m.contract("ICO", [token]);

  // Transfer all tokens to the ICO contract for distribution
  m.call(token, "transfer", [ico, FULL_SUPPLY], { after: [ico] });

  // Deploy InsuranceContract which uses the Coverly token for payments
  const insurance = m.contract("InsuranceContract", [token]);

  return { token, ico, insurance };
});
