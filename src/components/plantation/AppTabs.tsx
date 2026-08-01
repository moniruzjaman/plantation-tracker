import { FileText, BarChart3, Map, User } from "lucide-react";
import type { ComponentType } from "react";

interface AppTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unsyncedCount?: number;
}

// Matches legacy's 4-tab nav (ফর্ম / ড্যাশবোর্ড / ম্যাপ / প্রোফাইল).
// "আমার তথ্য" (My Data) lives inside the Profile tab, same as legacy's
// storedData tab, rather than as its own top-level nav item.
const tabs: Array<{ id: string; label: string; icon: ComponentType<any>; hasBadge?: boolean }> = [
  { id: "form", label: "নতুন তথ্য", icon: FileText },
  { id: "dashboard", label: "ড্যাশবোর্ড", icon: BarChart3 },
  { id: "map", label: "মানচিত্র", icon: Map },
  { id: "profile", label: "প্রোফাইল", icon: User, hasBadge: true },
];

export default function AppTabs({ activeTab, onTabChange, unsyncedCount = 0 }: AppTabsProps) {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]
        md:static md:border-t-0 md:shadow-none md:rounded-xl md:overflow-hidden md:border md:border-green-100
      "
    >
      {/* Mobile: horizontal scrollable row / Desktop: horizontal flex */}
      <ul className="flex md:gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const showBadge = tab.hasBadge && unsyncedCount > 0;

          return (
            <li key={tab.id} className="flex-1 md:flex-none">
              <button
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`
                  w-full flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-[11px] leading-tight
                  md:flex-row md:gap-2 md:px-5 md:py-2.5 md:text-sm md:font-medium
                  transition-colors duration-150 select-none
                  ${
                    isActive
                      ? "bg-[#15803d] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="relative">
                  <Icon className="w-5 h-5 md:w-4 md:h-4" />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-2.5 md:-top-2 md:-right-3 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1">
                      {unsyncedCount > 99 ? "৯৯+" : toBanglaNum(unsyncedCount)}
                    </span>
                  )}
                </span>
                <span>{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function toBanglaNum(n: number): string {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(n).replace(/\d/g, (d) => banglaDigits[Number(d)]);
}
