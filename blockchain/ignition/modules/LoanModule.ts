// ignition/modules/LoanModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LoanModule = buildModule("LoanModule", (m) => {
  const loanContract = m.contract("LoanContract", []);
  return { loanContract };
});

export default LoanModule;
