"use client";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  return (
    <div className="bg-sky-50 dark:bg-neutral-800 border border-gray-500 divide-y divide-x divide-gray-500">
      <Header />
      <Dashboard />
      <Footer isOpen={isContactOpen} setIsOpen={setIsContactOpen} />
    </div>
  );
}
