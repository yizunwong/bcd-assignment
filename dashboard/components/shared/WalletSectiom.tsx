"use client";

import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInsuranceContract } from "@/hooks/useBlockchain";

const WalletSection = () => {
  const { address: walletAddress } = useAccount();
  const { data: balanceData } = useBalance({ address: walletAddress });
  const { buyCoverlyTokens, isBuyingToken } = useInsuranceContract();
  const [tokenAmount, setTokenAmount] = useState(1);
  const eth = balanceData ? parseFloat(formatUnits(balanceData.value, 18)) : 0;
  const formattedEth = eth.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });

  const [ethToMyr, setEthToMyr] = useState<number | null>(null);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=myr"
    )
      .then((res) => res.json())
      .then((data) => {
        setEthToMyr(data.ethereum.myr);
      });
  }, []);

  return (
    <StyledWrapper>
      <div className="card">
        <svg
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 784.37 1277.39"
          clipRule="evenodd"
          fillRule="evenodd"
          imageRendering="optimizeQuality"
          textRendering="geometricPrecision"
          shapeRendering="geometricPrecision"
          version="1.1"
          height="100%"
          width="100%"
          xmlSpace="preserve"
          xmlns="http://www.w3.org/2000/svg"
          className="img"
        >
          <g id="Layer_x0020_1">
            <metadata id="CorelCorpID_0Corel-Layer" />
            <g id="_1421394342400">
              <g>
                <polygon
                  points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"
                  fillRule="nonzero"
                  fill="#343434"
                />
                <polygon
                  points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"
                  fillRule="nonzero"
                  fill="#8C8C8C"
                />
                <polygon
                  points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"
                  fillRule="nonzero"
                  fill="#3C3C3B"
                />
                <polygon
                  points="392.07,1277.38 392.07,956.52 -0,724.89"
                  fillRule="nonzero"
                  fill="#8C8C8C"
                />
                <polygon
                  points="392.07,882.29 784.13,650.54 392.07,472.33"
                  fillRule="nonzero"
                  fill="#141414"
                />
                <polygon
                  points="0,650.54 392.07,882.29 392.07,472.33"
                  fillRule="nonzero"
                  fill="#393939"
                />
              </g>
            </g>
          </g>
        </svg>
        <div className="textBox">
          <p className="head">Ethereum</p>
          <p className="price">{formattedEth} ETH</p>
          <p className="discription">
            {ethToMyr !== null
              ? `RM ${(eth * ethToMyr).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "Loading..."}
          </p>
        </div>
      </div>
      <div className="buy-token">
        <Input
          type="number"
          min={1}
          value={tokenAmount}
          onChange={(e) => setTokenAmount(Number(e.target.value))}
          className="token-input"
        />
        <Button
          onClick={() => buyCoverlyTokens(tokenAmount)}
          disabled={isBuyingToken}
        >
          {isBuyingToken ? "Purchasing..." : "Buy COV"}
        </Button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 265px;
    height: 200px;
    background: #1d2639;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    transition: 0.2s ease-in-out;
    position: relative;
    cursor: pointer;
  }

  .buy-token {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
  }

  .token-input {
    width: 80px;
  }

  .img {
    height: 60%;
    position: absolute;
    transition: 0.2s ease-in-out;
    z-index: 1;
  }

  .textBox {
    opacity: 0;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: end;
    width: 100%;
    height: 100%;
    gap: 0em;
    padding: 1em;
    z-index: 5;
    transition: 0.2s ease-in-out;
  }

  .textBox > .head {
    font-size: 1em;
    font-weight: bold;
  }

  .textBox > .price {
    font-size: 1em;
    font-weight: bold;
  }

  .textBox > .discription {
    font-size: 0.8em;
    color: lightgrey;
    font-weight: light;
  }

  .card:hover > .textBox {
    opacity: 1;
    gap: 0.5em;
  }

  .card:hover > .img {
    filter: blur(3px);
    animation: anim 3s infinite ease-in-out;
  }

  @keyframes anim {
    50% {
      transform: translateY(-10%) rotate(5deg);
    }
  }

  .card:hover {
    transform: scale(1.04);
  }
`;

export default WalletSection;
