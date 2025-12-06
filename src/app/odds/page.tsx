"use client";
import Header from "@/components/Header";
import OddsDashboard from "../../components/OddsDashboard";
import Footer from "@/components/Footer";
import { useState } from "react";
export default function OddsPage() {
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  return (
    <div className="bg-sky-50 dark:bg-neutral-800 border border-gray-500 divide-y divide-x divide-gray-500">
      <Header />
      <OddsDashboard />
      <Footer isOpen={isFooterOpen} setIsOpen={setIsFooterOpen} />
    </div>
  );
}
