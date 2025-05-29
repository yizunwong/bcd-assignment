"use client";

import React from "react";

import { print } from "@/utils/toast";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Home() {
  const notify = () => {
    print("Hello World", "success");
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />

        <button onClick={notify}>Click Me!!</button>
        <Footer />
      </div>
    </>
  );
}
