// scripts/export-frontend.ts
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

  // 2) Write ABI to dashboard/abi/
  const dashboardAbiDir = path.join(process.cwd(), "../dashboard/abi");
  await fs.mkdir(dashboardAbiDir, { recursive: true });
  const abiOutPath = path.join(dashboardAbiDir, "InsuranceContract.json");
  await fs.writeFile(
    abiOutPath,
    JSON.stringify(artifact.abi, null, 2),
    "utf-8"
  );

  // 3) Write env var into dashboard/.env.local
  //    Prefer CLI arg; fallback to the provided default
  const cliAddress = process.argv[2];
  const address = cliAddress || "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your given address

  const envFile = path.join(process.cwd(), "../dashboard", ".env");
  let content = "";
  try {
    content = await fs.readFile(envFile, "utf-8");
  } catch {
    // file may not exist yet — that’s fine
  }

  const line = `NEXT_PUBLIC_INSURANCE_CONTRACT_ADDRESS=${address}`;
  const regex = /^NEXT_PUBLIC_INSURANCE_CONTRACT_ADDRESS=.*$/m;

  if (regex.test(content)) {
    content = content.replace(regex, line);
  } else {
    content = (content ? content.trimEnd() + "\n" : "") + line + "\n";
  }

  await fs.writeFile(envFile, content, "utf-8");

  console.log("✅ ABI exported to:", abiOutPath);
  console.log("✅ .env updated with:", line);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
