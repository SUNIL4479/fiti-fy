import React from "react";
import { UserProfile } from "../../types";
import { BarChart3, Compass, Dumbbell, Settings, Sparkles } from "lucide-react";
import logo from "../../assets/images/logo.png";

interface NavbarProps {
  user: UserProfile | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenOnboarding: () => void;
}

const tabs = [
  { id: "dashboard", label: "Training", icon: Dumbbell },
  { id: "workout_studio", label: "Discover", icon: Compass },
  { id: "analytics", label: "Progress", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Navbar: React.FC<NavbarProps> = ({ user, activeTab, onSelectTab, onOpenOnboarding }) => {
  if (!user) {
    return <header className="relative z-20 flex h-16 items-center justify-between bg-white px-4 text-[#171a22] shadow-sm"><button onClick={() => onSelectTab("landing")} className="flex items-center gap-2 font-black"><img src={logo} className="h-9 w-9 rounded-xl object-contain" alt="FitiFy" /> FitiFy</button><button onClick={onOpenOnboarding} className="rounded-xl bg-[#1769e0] px-4 py-2 text-sm font-bold text-white">Get started</button></header>;
  }

  return (
    <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7e9ee] bg-white/95 px-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return <button key={id} onClick={() => onSelectTab(id)} className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-bold transition-colors ${active ? "text-[#1769e0]" : "text-[#9298a1]"}`}><Icon className={`h-6 w-6 ${active ? "fill-[#1769e0]/10" : ""}`} /><span>{label}</span></button>;
        })}
      </div>
    </nav>
  );
};
