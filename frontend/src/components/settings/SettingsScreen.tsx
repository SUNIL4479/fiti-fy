import React from "react";
import { ChevronRight, CircleHelp, Globe2, MessageSquareMore, Settings2, ShieldCheck, UserRound, Volume2, Waves } from "lucide-react";
import { UserProfile } from "../../types";

interface SettingsScreenProps {
  user: UserProfile;
  onEditProfile: () => void;
}

const settings = [
  { label: "Workout settings", detail: "Timer, rest and workout reminders", icon: Waves, color: "bg-[#ddf4e4] text-[#2d9c51]" },
  { label: "General settings", detail: "Units and app preferences", icon: Settings2, color: "bg-[#e5f1ff] text-[#2986d8]" },
  { label: "Voice guidance", detail: "Coach voice and countdowns", icon: Volume2, color: "bg-[#fff2d5] text-[#ec9e13]" },
  { label: "Language", detail: "English", icon: Globe2, color: "bg-[#eee8ff] text-[#7651d8]" },
  { label: "Help & feedback", detail: "Tell us what would help", icon: CircleHelp, color: "bg-[#e8f4f5] text-[#218897]" },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onEditProfile }) => (
  <div className="min-h-screen bg-[#f7f8fb] pb-28 text-[#171a22]">
    <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 sm:pt-8">
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">SETTINGS</h1>
      <button onClick={onEditProfile} className="mt-7 flex w-full items-center gap-4 rounded-3xl bg-white p-5 text-left shadow-[0_10px_30px_rgba(24,39,75,0.05)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf1ff] text-[#1769e0]"><UserRound className="h-6 w-6" /></div>
        <div className="min-w-0 flex-1"><p className="font-extrabold">{user.name}</p><p className="mt-0.5 truncate text-sm text-[#737987]">{user.heightCm} cm · {user.weightKg} kg · {user.goal.replace("_", " ")}</p></div>
        <ChevronRight className="h-5 w-5 text-[#a6acb5]" />
      </button>

      <div className="mt-5 rounded-3xl bg-gradient-to-r from-[#1769e0] to-[#1e80f2] p-5 text-white shadow-lg shadow-blue-100">
        <div className="flex items-center gap-3"><ShieldCheck className="h-7 w-7" /><div><p className="font-extrabold">Your personal plan</p><p className="mt-0.5 text-sm text-blue-100">Your workouts adapt as your goals change.</p></div></div>
      </div>

      <section className="mt-5 overflow-hidden rounded-3xl bg-white px-5 shadow-[0_10px_30px_rgba(24,39,75,0.05)]">
        {settings.map(({ label, detail, icon: Icon, color }) => <button key={label} className="flex w-full items-center gap-4 border-b border-[#f0f1f4] py-4 text-left last:border-0">
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></span>
          <span className="min-w-0 flex-1"><span className="block font-bold">{label}</span><span className="mt-0.5 block text-sm text-[#7c838f]">{detail}</span></span>
          <ChevronRight className="h-5 w-5 text-[#b0b5bd]" />
        </button>)}
      </section>
      <button className="mt-5 flex w-full items-center gap-3 rounded-2xl bg-white px-5 py-4 text-left text-sm font-bold text-[#4e6e95] shadow-[0_10px_30px_rgba(24,39,75,0.05)]"><MessageSquareMore className="h-5 w-5" /> Share FitiFy with a friend</button>
    </div>
  </div>
);
