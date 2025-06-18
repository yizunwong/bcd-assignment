import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeploymentModule = buildModule("DeploymentModule", (m) => {
  const CoverlyToken = m.contract("CoverlyToken");
  const ICO = m.contract("ICO", [CoverlyToken]);

  const owner = m.getAccount(0);
  const totalSupply = m.staticCall(CoverlyToken, "totalSupply");
  m.call(CoverlyToken, "approve", [ICO, totalSupply], {
    from: owner,
  });

  return { CoverlyToken, ICO };
});

export default DeploymentModule;
