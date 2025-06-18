"use client";
import { BuyToken } from '@/components/BuyToken';
import { Connect } from "@/components/Connect";
import Image from "next/image";
import React from "react";

const MetaConnect = () => {
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
  };

  const connectWallet = () => {
    if (!isMetaMaskInstalled()) {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
      window.open("https://metamask.io/download.html", "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 font-[Inter]">
      <div className="container mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-16 text-white">
          <div className="flex items-center">
            <Image
              src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
              alt="MetaMask"
              className="w-10 h-10 mr-3"
              width={40}
              height={40}
            />
            <h1 className="text-2xl font-bold">MetaConnect</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="hover:text-orange-300 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-300 transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-300 transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-300 transition">
                  Support
                </a>
              </li>
            </ul>
          </nav>
        </header>

        <div className="flex flex-col md:flex-row items-center justify-between mb-20">
          <div className="md:w-1/2 mb-10 md:mb-0 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Connect Your <span className="text-orange-400">MetaMask</span>{" "}
              Wallet
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-lg">
              Access the decentralized web with a single click. Securely connect
              your MetaMask wallet to explore blockchain applications.
            </p>
            <div className="flex space-x-4">
              <div onClick={connectWallet} role="button">
                <Connect />
              </div>
              <a
                href="#learn-more"
                className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-900 transition"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="metamask-card p-8 w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-lg backdrop-blur">
              <div className="flex justify-center mb-6">
                <Image
                  src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
                  alt="MetaMask"
                  className="w-24 h-24"
                  width={96}
                  height={96}
                />
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Connect to MetaMask
              </h3>
              <p className="text-gray-600 text-center mb-8">
                Link your wallet to access decentralized applications and manage
                your digital assets.
              </p>
              <div className="flex justify-center">
                <div onClick={connectWallet} role="button">
                  <Connect />
                  <BuyToken />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaConnect;
