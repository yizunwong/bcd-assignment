import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeploymentModule = buildModule("DeploymentModule", (m) => {
  const TestToken = m.contract("TestToken");
  const ICO = m.contract("ICO", [TestToken]);

  const owner = m.getAccount(0);
  const totalSupply = m.staticCall(TestToken, "totalSupply");
  m.call(TestToken, "approve", [ICO, totalSupply], {
    from: owner,
  });

  return { TestToken, ICO };
});

export default DeploymentModule;