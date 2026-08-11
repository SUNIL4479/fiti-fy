import React, { useState } from "react";
import { UserProfile, WorkoutPlan } from "../../types";
import { WorkoutService } from "../../services/workoutService";
import { ArrowRight, Clock3, Dumbbell, Search, Sparkles, Target } from "lucide-react";

interface DiscoverWorkoutsProps { user: UserProfile; onLaunchWorkout: (workout: WorkoutPlan) => void; onOpenNutrition: () => void; }
const categories = ["All", "Beginner", "Abs", "Full body", "Stretching"];
const programs = [
  { title: "Quick morning boost", minutes: 10, focus: "Full body", tone: "from-[#34a97a] to-[#16876a]" },
  { title: "Core strength basics", minutes: 15, focus: "Abs", tone: "from-[#7753dd] to-[#4d35b0]" },
  { title: "Low-impact cardio", minutes: 20, focus: "Fat burn", tone: "from-[#f1963a] to-[#e2673c]" },
  { title: "Mobility reset", minutes: 12, focus: "Stretching", tone: "from-[#3698d8] to-[#1769e0]" },
];

export const DiscoverWorkouts: React.FC<DiscoverWorkoutsProps> = ({ user, onLaunchWorkout, onOpenNutrition }) => {
  const [category, setCategory] = useState("All");
  const makePlan = (title: string, minutes: number) => onLaunchWorkout(WorkoutService.generatePersonalizedWorkout(user, title, minutes));
  return <div className="min-h-screen bg-[#f7f8fb] pb-28 text-[#171a22]"><div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 sm:pt-8">
    <header><p className="text-xs font-bold tracking-[0.16em] text-[#1769e0] uppercase">Find your next session</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">DISCOVER</h1></header>
    <label className="mt-6 flex h-13 items-center gap-3 rounded-2xl bg-[#eef0f4] px-4 text-[#8a909b]"><Search className="h-5 w-5" /><input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8a909b]" placeholder="Search workouts and plans..." /></label>
    <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold ${category === item ? "bg-[#1769e0] text-white" : "bg-white text-[#737987]"}`}>{item}</button>)}</div>
    <section className="mt-7"><div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-extrabold">Programs for you</h2><span className="text-sm font-bold text-[#1769e0]">View all</span></div><div className="grid gap-4 sm:grid-cols-2">{programs.filter((item) => category === "All" || item.focus === category || category === "Beginner").map((program) => <button onClick={() => makePlan(program.title, program.minutes)} key={program.title} className={`overflow-hidden rounded-3xl bg-gradient-to-br ${program.tone} p-5 text-left text-white shadow-lg`}><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20"><Dumbbell className="h-5 w-5" /></div><h3 className="mt-9 text-xl font-black">{program.title}</h3><div className="mt-2 flex gap-3 text-sm text-white/85"><span className="flex items-center gap-1"><Clock3 className="h-4 w-4" />{program.minutes} min</span><span className="flex items-center gap-1"><Target className="h-4 w-4" />{program.focus}</span></div><span className="mt-5 flex items-center gap-1 text-sm font-black">START <ArrowRight className="h-4 w-4" /></span></button>)}</div></section>
    <button onClick={onOpenNutrition} className="mt-7 flex w-full items-center gap-4 rounded-3xl bg-white p-5 text-left shadow-[0_10px_30px_rgba(24,39,75,0.05)]"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff3d9] text-[#ef9a1b]"><Sparkles className="h-5 w-5" /></span><span className="flex-1"><span className="block font-extrabold">Need a food idea?</span><span className="mt-0.5 block text-sm text-[#737987]">Open your AI nutrition plan for meals matched to you.</span></span><ArrowRight className="h-5 w-5 text-[#1769e0]" /></button>
  </div></div>;
};
