// src/components/ui/Tabs.jsx
"use client";

import { cn } from "@/lib/cn";
import React, { createContext, useContext, useState } from "react";

// Tabs Context
const TabsContext = createContext();

const Tabs = ({ children, defaultValue, value, onValueChange, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || value || "");

  const handleTabChange = (tabValue) => {
    if (onValueChange) {
      onValueChange(tabValue);
    }
    setActiveTab(tabValue);
  };

  const currentValue = value !== undefined ? value : activeTab;

  return (
    <TabsContext.Provider
      value={{ activeTab: currentValue, setActiveTab: handleTabChange }}
    >
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

// TabsList Component
const TabsList = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 border-b border-gray-200 pb-2 mb-6",
        className,
      )}
    >
      {children}
    </div>
  );
};

// TabsTrigger Component
const TabsTrigger = ({ children, value, className }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);

  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
        isActive
          ? "bg-primary text-white shadow-md shadow-primary/25"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900",
        className,
      )}
    >
      {children}
    </button>
  );
};

// TabsContent Component
const TabsContent = ({ children, value, className }) => {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) {
    return null;
  }

  return (
    <div className={cn("animate-in fade-in-50 duration-300", className)}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
