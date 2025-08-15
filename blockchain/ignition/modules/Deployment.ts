// ignition/modules/Deployment.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FULL_SUPPLY = 100_000n * 10n ** 18n;

export default buildModule("Deployment", (m) => {
  // Deploy Coverly ERC20 token
  const token = m.contract("CoverlyToken");

  // Deploy ICO contract with token's address (pass the deployment future)
  const ico = m.contract("ICO", [token]);

  // Transfer all tokens to the ICO contract after ICO is deployed
  m.call(token, "transfer", [ico, FULL_SUPPLY], { after: [ico] });

  // Deploy InsuranceContract with token's address
  const insurance = m.contract("InsuranceContract", [token]);

  return { token, ico, insurance };
});
