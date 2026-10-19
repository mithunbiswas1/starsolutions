"use client";

import { useState } from "react";
import { H3 } from "@/components/ui/Typography";
import { technologiesData as defaultTechnologies } from "../_data/technologiesData";

export default function TechnologiesTabs({ technologies }) {
  const data = technologies || defaultTechnologies;
  const tabs = Object.keys(data);
  const [activeTab, setActiveTab] = useState(tabs[0] || "Mobile Apps");

  if (!data || tabs.length === 0) return null;

  const currentTabContent = data[activeTab];

  return (
    <div>
      <div className="lg:grid lg:grid-cols-[280px_1fr]">
        {/* Mobile Tabs */}
        <div className="lg:hidden sticky top-16 bg-[#080c14]/95 backdrop-blur-md z-20 border-b border-white/10 py-3 px-2">
          <div className="overflow-x-auto">
            <div className="flex w-max gap-2 px-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
                      : "glass-badge bg-white/[0.05] border border-white/10 text-gray-300 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden lg:block border-r border-white/10">
          <div className="flex flex-col py-6 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`mx-3 px-5 py-3 text-left text-base rounded-2xl transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
                    : "text-gray-300 hover:bg-white/[0.05] hover:text-white font-medium"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content with Frosted Glass Cards */}
        <div className="p-4 sm:p-6 lg:p-10">
          {currentTabContent?.sections?.map((section) => (
            <div key={section.title} className="mb-8 last:mb-0">
              <H3 className="font-bold mb-4 text-white">{section.title}</H3>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.name}
                      className="glass-dark bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md rounded-2xl px-4 py-3.5 flex items-center gap-3 border border-white/10 hover:border-primary/40 shadow-xs hover:shadow-lg transition-all duration-300 group cursor-default"
                    >
                      {Icon && (
                        <Icon className="w-5 h-5 lg:w-6 lg:h-6 shrink-0 text-primary group-hover:scale-110 transition-transform" />
                      )}

                      <span className="text-sm sm:text-base font-semibold text-white group-hover:text-primary transition-colors">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
