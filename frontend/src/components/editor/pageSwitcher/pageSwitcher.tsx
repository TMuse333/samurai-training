"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useWebsiteStore from "@/stores/websiteStore";

export function PageSwitcher() {
  const router = useRouter();
  const { websiteData } = useWebsiteStore();

  const pages = websiteData?.pages || {};

  return (
    <div className="fixed top-16 right-4 z-50 bg-white dark:bg-gray-800 rounded shadow-lg p-4 min-w-[200px]">
      <h3 className="font-semibold mb-2">Pages</h3>
      <div className="space-y-1">
        {Object.values(pages).map((page,index) => (
          <button
            key={index}
            onClick={() => router.push(`/${page.slug}`)}
            className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {page.pageName}
          </button>
        ))}
      </div>
    </div>
  );
}

