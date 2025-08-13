// scripts/export-artifacts.ts
import { promises as fs } from "fs";
import path from "path";

async function main() {
  // 1) Read Hardhat artifact
  const artifactPath = path.join(
    process.cwd(),
    "artifacts",
    "contracts",
    "InsuranceContract.sol",
    "InsuranceContract.json"
  );
  const artifactRaw = await fs.readFile(artifactPath, "utf-8");
  const artifact = JSON.parse(artifactRaw);

  // 2) CLI arg for address (fallback to default)
  const cliAddress = process.argv[2];
  const address = cliAddress || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // === Export to Dashboard ===
  const dashboardAbiDir = path.join(process.cwd(), "../dashboard/abi");
  await fs.mkdir(dashboardAbiDir, { recursive: true });
  await fs.writeFile(
    path.join(dashboardAbiDir, "InsuranceContract.json"),
    JSON.stringify(artifact.abi, null, 2),
    "utf-8"
  );

  const dashboardEnv = path.join(process.cwd(), "../dashboard", ".env");
  await updateEnvFile(
    dashboardEnv,
    address,
    "NEXT_PUBLIC_INSURANCE_CONTRACT_ADDRESS"
  );

  const backendEnv = path.join(process.cwd(), "../backend", ".env");
  await updateEnvFile(backendEnv, address, "INSURANCE_CONTRACT_ADDRESS");

  console.log("✅ ABI exported to dashboard and backend");
  console.log("✅ Contract address updated in both .env files");
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
