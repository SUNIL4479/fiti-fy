import React, { useMemo, useState } from "react";
import { UserProfile, WorkoutPlan, Badge } from "../../types";
import {
  Apple,
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Dumbbell,
  Flame,
  Play,
  Search,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

interface DashboardOverviewProps {
  user: UserProfile;
  recommendedWorkout: WorkoutPlan;
  badges: Badge[];
  onStartWorkout: (workout: WorkoutPlan) => void;
  onOpenChat: () => void;
  onOpenNutrition: () => void;
  onUpdateWater: (amountMl: number) => void;
  onUpdateWeight: (newWeightKg: number) => void;
}

const focusAreas = ["Abs", "Arms", "Chest", "Legs", "Shoulders", "Full body"];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  user,
  recommendedWorkout,
  badges,
  onStartWorkout,
  onOpenChat,
  onOpenNutrition,
}) => {
  const [focus, setFocus] = useState("Abs");
  const todayIndex = new Date().getDay();
  const week = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - todayIndex + index);
      return { label: day.toLocaleDateString(undefined, { weekday: "narrow" }), date: day.getDate(), active: index === todayIndex };
    });
  }, [todayIndex]);
  const completedWorkouts = user.workoutLogs?.length || 0;

  return (
    <div className="min-h-screen bg-[#f7f8fb] pb-28 text-[#171a22]">
      <div className="mx-auto max-w-3xl px-4 pt-5 sm:px-6 sm:pt-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#727987] uppercase">FitiFy</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">HOME WORKOUT</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 items-center gap-1.5 rounded-full bg-[#fff1ee] px-3 text-sm font-bold text-[#f04e55]">
              <Flame className="h-5 w-5 fill-current" /> {user.streakDays || 1}
            </span>
            <button onClick={onOpenChat} className="flex h-10 items-center gap-1.5 rounded-full bg-[#eaf1ff] px-3 text-sm font-bold text-[#1769e0]" aria-label="Open AI Coach">
              <Bot className="h-5 w-5" /> <span className="hidden sm:inline">Coach</span>
            </button>
          </div>
        </header>

        <label className="mb-6 flex h-13 items-center gap-3 rounded-2xl bg-[#eef0f4] px-4 text-[#8a909b]">
          <Search className="h-5 w-5" />
          <input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8a909b]" placeholder="Search workouts, plans..." aria-label="Search workouts" />
        </label>

        <section className="mb-7 rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(24,39,75,0.05)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold">Weekly goal</h2>
              <p className="mt-0.5 text-sm text-[#737987]">Build a consistent routine</p>
            </div>
            <span className="text-lg font-black text-[#1769e0]">{Math.min(4, completedWorkouts)}/4</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {week.map((day) => (
              <div key={`${day.label}-${day.date}`} className="space-y-2">
                <span className="block text-xs font-medium text-[#8a909b]">{day.label}</span>
                <span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${day.active ? "bg-[#1769e0] text-white shadow-md shadow-blue-200" : "text-[#686f7b]"}`}>
                  {day.active ? <Check className="h-5 w-5" /> : day.date}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#f0f3f8] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dce9ff] text-[#1769e0]"><Trophy className="h-5 w-5" /></div>
            <p className="text-sm font-semibold leading-5">Small daily sessions add up. Your next workout is ready!</p>
          </div>
        </section>

        <section className="mb-7">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-extrabold">Today&apos;s challenge</h2><span className="text-sm font-bold text-[#1769e0]">For you</span></div>
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1f7af3] via-[#1264e7] to-[#0646bd] p-6 text-white shadow-xl shadow-blue-200">
            <div className="absolute -right-9 -top-10 h-48 w-48 rounded-full border-[22px] border-white/10" />
            <div className="relative max-w-sm">
              <span className="rounded-lg bg-[#ffe1c9] px-3 py-1 text-[11px] font-black tracking-wide text-[#87511d] uppercase">Personalized plan</span>
              <h3 className="mt-4 text-3xl font-black leading-tight">FULL BODY<br />ENERGY</h3>
              <p className="mt-2 text-sm text-blue-100">Built for {user.experience} level · zero equipment</p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-semibold">
                <span className="flex items-center gap-2"><Clock3 className="h-4 w-4" />{recommendedWorkout.totalMinutes} min</span>
                <span className="flex items-center gap-2"><Target className="h-4 w-4" />{focus} focus</span>
              </div>
              <button onClick={() => onStartWorkout(recommendedWorkout)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-extrabold text-[#1769e0] transition-transform hover:scale-[1.01]">
                <Play className="h-4 w-4 fill-current" /> START WORKOUT <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="mb-7">
          <h2 className="mb-3 text-xl font-extrabold">Body focus</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {focusAreas.map((area) => <button key={area} onClick={() => setFocus(area)} className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-colors ${focus === area ? "border border-[#1769e0] bg-[#eaf1ff] text-[#1769e0]" : "bg-[#eef0f4] text-[#858b96]"}`}>{area}</button>)}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <button onClick={onOpenNutrition} className="rounded-3xl bg-white p-5 text-left shadow-[0_10px_30px_rgba(24,39,75,0.05)] transition-transform hover:-translate-y-0.5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ebf8ef] text-[#32a852]"><Apple className="h-5 w-5" /></div>
            <h3 className="font-extrabold">Smart food suggestions</h3>
            <p className="mt-1 text-sm leading-5 text-[#737987]">AI meals adjusted to your {user.heightCm} cm height and {user.weightKg} kg weight.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#1769e0]">View food plan <ChevronRight className="h-4 w-4" /></span>
          </button>
          <button onClick={onOpenChat} className="rounded-3xl bg-white p-5 text-left shadow-[0_10px_30px_rgba(24,39,75,0.05)] transition-transform hover:-translate-y-0.5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1ecff] text-[#7651d8]"><Sparkles className="h-5 w-5" /></div>
            <h3 className="font-extrabold">Ask your AI coach</h3>
            <p className="mt-1 text-sm leading-5 text-[#737987]">Get form help, easier variations, or a quick motivation boost.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#1769e0]">Start a chat <ChevronRight className="h-4 w-4" /></span>
          </button>
        </section>
      </div>
    </div>
  );
};
