import React, { useState } from "react";
import { UserProfile, MealPlan } from "../../types";
import { apiFetch } from "../../services/api";
import { Apple, Clock3, Droplets, Loader2, Sparkles, Utensils } from "lucide-react";

interface NutritionPlannerProps { user: UserProfile; }

const starterPlan = (user: UserProfile): MealPlan => ({
  dailyCalories: user.calorieTarget || Math.round(user.weightKg * 30), proteinGrams: Math.round(user.weightKg * 1.7), carbsGrams: Math.round(user.weightKg * 2.8), fatsGrams: Math.round(user.weightKg * 0.8), waterLiters: user.waterGoalLiters || 2.5,
  meals: {
    breakfast: { name: "Protein oats with berries", calories: 420, protein: "28g protein", description: "Oats, yogurt or plant protein, berries and seeds for a steady start.", ingredients: ["Oats", "Protein yogurt", "Berries", "Chia seeds"] },
    lunch: { name: "Colourful grain bowl", calories: 560, protein: "35g protein", description: "A balanced bowl with your preferred protein, whole grains and vegetables.", ingredients: ["Brown rice", "Chicken or tofu", "Greens", "Avocado"] },
    dinner: { name: "Roasted vegetables & protein", calories: 520, protein: "34g protein", description: "A simple recovery meal with slow carbohydrates and satisfying protein.", ingredients: ["Salmon or lentils", "Sweet potato", "Broccoli", "Olive oil"] },
    snack: { name: "Fruit and nuts", calories: 210, protein: "10g protein", description: "An easy snack that keeps hunger in check between meals.", ingredients: ["Seasonal fruit", "Greek yogurt", "Walnuts"] },
  },
  coachTip: "Aim to include protein and a colourful fruit or vegetable at each meal."
});

export const NutritionPlanner: React.FC<NutritionPlannerProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan>(() => starterPlan(user));
  const bmi = user.bmi || Number((user.weightKg / Math.pow(user.heightCm / 100, 2)).toFixed(1));
  const generate = async () => {
    setLoading(true);
    try {
      const response = await apiFetch("ai/generate-nutrition", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile: user }) });
      const data = await response.json();
      if (data.success && data.mealPlan) setMealPlan(data.mealPlan);
    } catch (error) { console.error("Unable to generate nutrition plan", error); }
    finally { setLoading(false); }
  };
  const meals = [["Breakfast", mealPlan.meals.breakfast, "08:00"], ["Lunch", mealPlan.meals.lunch, "13:00"], ["Dinner", mealPlan.meals.dinner, "19:00"], ["Snack", mealPlan.meals.snack, "16:00"]] as const;
  return <div className="min-h-screen bg-[#f7f8fb] pb-28 text-[#171a22]"><div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 sm:pt-8">
    <header className="mb-6"><p className="text-xs font-bold tracking-[0.16em] text-[#1769e0] uppercase">FitiFy smart nutrition</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">YOUR FOOD PLAN</h1><p className="mt-2 text-sm text-[#737987]">Nutritious suggestions tailored to your measurements and goal.</p></header>
    <section className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(24,39,75,0.05)]"><div className="flex items-start justify-between"><div><h2 className="text-lg font-extrabold">Your daily targets</h2><p className="mt-1 text-sm text-[#737987]">Based on {user.heightCm} cm, {user.weightKg} kg and BMI {bmi}</p></div><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ebf8ef] text-[#32a852]"><Apple className="h-5 w-5" /></span></div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Calories", `${mealPlan.dailyCalories}`, "kcal"], ["Protein", `${mealPlan.proteinGrams}`, "g"], ["Carbs", `${mealPlan.carbsGrams}`, "g"], ["Water", `${mealPlan.waterLiters}`, "L"]].map(([label, value, unit]) => <div key={label} className="rounded-2xl bg-[#f5f7fa] p-3"><span className="text-xs font-semibold text-[#7c838f]">{label}</span><p className="mt-1 text-xl font-black">{value}<small className="ml-0.5 text-xs font-bold text-[#7c838f]">{unit}</small></p></div>)}</div>
      <button disabled={loading} onClick={generate} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1769e0] py-3.5 text-sm font-extrabold text-white disabled:opacity-70">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{loading ? "Creating your food suggestions..." : "Generate AI food suggestions"}</button>
    </section>
    <div className="mt-7 mb-3 flex items-center justify-between"><h2 className="text-xl font-extrabold">Today&apos;s meals</h2><span className="text-sm font-bold text-[#1769e0]">{mealPlan.dailyCalories} kcal</span></div>
    <div className="space-y-3">{meals.map(([time, meal, clock]) => <article key={time} className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(24,39,75,0.05)]"><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eaf1ff] text-[#1769e0]"><Utensils className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="font-extrabold">{time}</span><span className="text-xs font-bold text-[#7c838f]">{meal.calories} kcal · {meal.protein}</span></div><h3 className="mt-2 font-bold">{meal.name}</h3><p className="mt-1 text-sm leading-5 text-[#737987]">{meal.description}</p><div className="mt-3 flex flex-wrap gap-1.5">{meal.ingredients.slice(0, 4).map((item) => <span key={item} className="rounded-lg bg-[#f2f4f7] px-2 py-1 text-xs font-medium text-[#626976]">{item}</span>)}</div><span className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#8a909b]"><Clock3 className="h-3.5 w-3.5" /> Around {clock}</span></div></div></article>)}</div>
    <p className="mt-5 flex items-start gap-2 rounded-2xl bg-[#fff5dc] p-4 text-sm leading-5 text-[#79581d]"><Droplets className="mt-0.5 h-4 w-4 shrink-0" />{mealPlan.coachTip}</p>
  </div></div>;
};
