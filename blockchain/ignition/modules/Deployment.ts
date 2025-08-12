// ignition/modules/InsuranceContract.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Deployment", (m) => {
  // Deploy InsuranceContract (no constructor args)
  const insurance = m.contract("InsuranceContract");

  // You can export anything you want to reference later
  return { insurance };
});
