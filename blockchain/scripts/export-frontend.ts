// scripts/export-artifacts.ts
import { promises as fs } from "fs";
import path from "path";

interface ContractInfo {
  name: string;
  address: string;
  dashboardKey: string;
  backendKey: string;
}

async function main() {
  const defaultAddresses = [
    "0x5FbDB2315678afecb367f032d93F642f64180aa3", // CoverlyToken
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // ICO
    "0x9fE46736679d2D9a65F0992F2272dD7dC6eF1c4a", // InsuranceContract
  ];

  const tokenAddress = process.argv[2] || defaultAddresses[0];
  const icoAddress = process.argv[3] || defaultAddresses[1];
  const insuranceAddress = process.argv[4] || defaultAddresses[2];

  const contracts: ContractInfo[] = [
    {
      name: "CoverlyToken",
      address: tokenAddress,
      dashboardKey: "NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS",
      backendKey: "TOKEN_CONTRACT_ADDRESS",
    },
    {
      name: "ICO",
      address: icoAddress,
      dashboardKey: "NEXT_PUBLIC_ICO_CONTRACT_ADDRESS",
      backendKey: "ICO_CONTRACT_ADDRESS",
    },
    {
      name: "InsuranceContract",
      address: insuranceAddress,
      dashboardKey: "NEXT_PUBLIC_INSURANCE_CONTRACT_ADDRESS",
      backendKey: "INSURANCE_CONTRACT_ADDRESS",
    },
  ];

  const dashboardAbiDir = path.join(process.cwd(), "../dashboard/abi");
  await fs.mkdir(dashboardAbiDir, { recursive: true });

  const dashboardEnv = path.join(process.cwd(), "../dashboard", ".env");
  const backendEnv = path.join(process.cwd(), "../backend", ".env");

  for (const contract of contracts) {
    const artifactPath = path.join(
      process.cwd(),
      "artifacts",
      "contracts",
      `${contract.name}.sol`,
      `${contract.name}.json`
    );
    const artifactRaw = await fs.readFile(artifactPath, "utf-8");
    const artifact = JSON.parse(artifactRaw);

    await fs.writeFile(
      path.join(dashboardAbiDir, `${contract.name}.json`),
      JSON.stringify(artifact.abi, null, 2),
      "utf-8"
    );

    await updateEnvFile(dashboardEnv, contract.address, contract.dashboardKey);
    await updateEnvFile(backendEnv, contract.address, contract.backendKey);
  }

  console.log("✅ ABIs exported to dashboard");
  console.log("✅ Contract addresses updated in dashboard and backend .env files");
}

async function updateEnvFile(envPath: string, address: string, envKey: string) {
  let content = "";
  try {
    content = await fs.readFile(envPath, "utf-8");
  } catch {
    // file may not exist — that's fine
  }

  const line = `${envKey}=${address}`;
  const regex = new RegExp(`^${envKey}=.*$`, "m");

  if (regex.test(content)) {
    content = content.replace(regex, line);
  } else {
    content = (content ? content.trimEnd() + "\n" : "") + line + "\n";
  }

  await fs.writeFile(envPath, content, "utf-8");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
