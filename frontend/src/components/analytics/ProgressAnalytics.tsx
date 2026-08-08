import React, { useState } from "react";
import { UserProfile } from "../../types";
import { Activity, Scale, Calendar, Award, TrendingUp, CheckCircle2, FileText } from "lucide-react";

interface ProgressAnalyticsProps {
  user: UserProfile;
  saveProfile: (profile: UserProfile) => void;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ user, saveProfile }) => {
  const [chestCm, setChestCm] = useState<number>(user.bodyMeasurements?.chestCm || 92);
  const [waistCm, setWaistCm] = useState<number>(user.bodyMeasurements?.waistCm || 78);
  const [hipCm, setHipCm] = useState<number>(user.bodyMeasurements?.hipCm || 95);
  const [bicepCm, setBicepCm] = useState<number>(user.bodyMeasurements?.bicepCm || 32);

  const weightHistory = user.weightLogs && user.weightLogs.length > 0 
    ? user.weightLogs 
    : [{ date: new Date().toLocaleDateString(), weightKg: user.weightKg }];
    
  const workoutCount = user.workoutLogs ? user.workoutLogs.length : 0;
  const workoutMins = user.workoutLogs ? user.workoutLogs.reduce((acc, log) => acc + log.minutes, 0) : 0;

  const handleUpdateMeasurements = (type: string, value: number) => {
    // Local state update
    if (type === 'chest') setChestCm(value);
    if (type === 'waist') setWaistCm(value);
    if (type === 'hip') setHipCm(value);
    if (type === 'bicep') setBicepCm(value);

    // Debounced or direct save (for simplicity, we'll just save it directly here, though typically you'd debounce sliders)
    const updatedUser = {
      ...user,
      bodyMeasurements: {
        ...user.bodyMeasurements,
        [type + "Cm"]: value
      }
    };
    saveProfile(updatedUser);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Progress Analytics & Measurements</h1>
        <p className="text-slate-300 text-sm">Track your body metrics, workout history, and monthly AI fitness progress.</p>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-[#222222] rounded-[24px] p-6 space-y-2">
          <div className="text-xs text-[#666666] font-semibold uppercase tracking-wider">BMI Category</div>
          <div className="text-3xl font-black text-[#c6ff00]">{user.bmi || 22.5}</div>
          <div className="text-xs text-[#c6ff00] font-semibold">Healthy Range • {user.bodyType}</div>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-[24px] p-6 space-y-2">
          <div className="text-xs text-[#666666] font-semibold uppercase tracking-wider">Total Workout Volume</div>
          <div className="text-3xl font-black text-white">{workoutCount} Sessions</div>
          <div className="text-xs text-slate-400">{workoutMins} Minutes Total Logged</div>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-[24px] p-6 space-y-2">
          <div className="text-xs text-[#666666] font-semibold uppercase tracking-wider">Fitness Score Trend</div>
          <div className="text-3xl font-black text-purple-400">{user.initialFitnessScore || 80} / 100</div>
          <div className="text-xs text-purple-300 font-semibold">Active</div>
        </div>
      </div>

      {/* Weight Trend Chart & Consistency Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weight Log */}
        <div className="lg:col-span-7 bg-[#111111] border border-[#222222] rounded-[24px] p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#c6ff00]" />
            <span>Weight Progress History</span>
          </h3>

          <div className="p-4 rounded-2xl bg-[#050505] border border-[#222222] space-y-4">
            <div className="h-44 flex items-end justify-between gap-3 px-2 pt-6">
              {weightHistory.map((item, i) => {
                const maxW = Math.max(...weightHistory.map((w) => w.weightKg));
                const minW = Math.min(...weightHistory.map((w) => w.weightKg)) - 2;
                const hPercent = Math.round(((item.weightKg - minW) / (maxW - minW)) * 100);

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-[#c6ff00]">{item.weightKg} kg</span>
                    <div className="w-full bg-[#1a1a1a] rounded-t-xl overflow-hidden h-32 flex items-end border border-[#222222]">
                      <div
                        className="w-full bg-[#c6ff00] rounded-t-xl transition-all duration-500"
                        style={{ height: `${Math.max(20, hPercent)}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-400">{new Date(item.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Body Measurements Log */}
        <div className="lg:col-span-5 bg-[#111111] border border-[#222222] rounded-[24px] p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Body Circumference Logs</h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 flex justify-between">
                <span>Chest</span>
                <span className="text-[#c6ff00] font-bold">{chestCm} cm</span>
              </label>
              <input
                type="range"
                min="70"
                max="140"
                value={chestCm}
                onChange={(e) => handleUpdateMeasurements('chest', Number(e.target.value))}
                className="w-full accent-[#c6ff00] h-2 bg-[#1a1a1a] rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 flex justify-between">
                <span>Waist</span>
                <span className="text-[#c6ff00] font-bold">{waistCm} cm</span>
              </label>
              <input
                type="range"
                min="50"
                max="130"
                value={waistCm}
                onChange={(e) => handleUpdateMeasurements('waist', Number(e.target.value))}
                className="w-full accent-[#c6ff00] h-2 bg-[#1a1a1a] rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 flex justify-between">
                <span>Hips</span>
                <span className="text-[#c6ff00] font-bold">{hipCm} cm</span>
              </label>
              <input
                type="range"
                min="60"
                max="140"
                value={hipCm}
                onChange={(e) => handleUpdateMeasurements('hip', Number(e.target.value))}
                className="w-full accent-[#c6ff00] h-2 bg-[#1a1a1a] rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 flex justify-between">
                <span>Biceps</span>
                <span className="text-[#c6ff00] font-bold">{bicepCm} cm</span>
              </label>
              <input
                type="range"
                min="20"
                max="55"
                value={bicepCm}
                onChange={(e) => handleUpdateMeasurements('bicep', Number(e.target.value))}
                className="w-full accent-[#c6ff00] h-2 bg-[#1a1a1a] rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
