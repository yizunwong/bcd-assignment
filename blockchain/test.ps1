# Create backend folder and enter it
mkdir backend
cd backend

# Initialize Node project
npm init -y

# Install dependencies
npm install express cors dotenv web3

# Install TypeScript & related tools
npm install -D typescript ts-node-dev @types/node @types/express

# Initialize TypeScript config
npx tsc --init

# Create tsconfig.json overrides for Node.js
(Get-Content tsconfig.json) -replace '"target": ".*?"', '"target": "ES2020"' |
  Set-Content tsconfig.json
(Get-Content tsconfig.json) -replace '"module": ".*?"', '"module": "CommonJS"' |
  Set-Content tsconfig.json

# Create folders
mkdir src, src\routes, src\controllers, src\services, src\utils

# Create main index.ts
@"
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running (TS)!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
"@ | Out-File -Encoding utf8 src\index.ts

# Create .env file
@"
PORT=5000
RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
TOKEN_ADDRESS=0xYourContractAddress
"@ | Out-File -Encoding utf8 .env

# Create nodemon config
@"
{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node-dev src/index.ts"
}
"@ | Out-File -Encoding utf8 nodemon.json
