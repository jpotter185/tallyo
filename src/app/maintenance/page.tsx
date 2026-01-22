"use client";
import Footer from "@/components/Footer";
import { useState } from "react";

// app/maintenance/page.tsx
export default function MaintenancePage() {
  const [isFooterOpen, setIsFooterOpen] = useState<boolean>(false);
  return (
    <div className="bg-sky-50 dark:bg-neutral-800 border border-gray-500 divide-y divide-x divide-gray-500">
      <div className="p-1 text-4xl font-extrabold text-gray-900 dark:text-white bg-color-white">
        Tallyo
      </div>
      <div className="p-5">
        Under Construction, with football ending, new sports will be added, stay
        tuned!
      </div>
      <Footer isOpen={isFooterOpen} setIsOpen={setIsFooterOpen} />
    </div>
  );
}
