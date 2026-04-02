import React from "react";
import { GraduationCap, MapPin, User, ChevronRight } from "lucide-react";

function RpCard({ student }) {
  if (!student) return null;

  const balance = Number(student.balance_points) || 0;
  const isHighPerformer = balance >= 300;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/60 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-indigo-500/50">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-indigo-500/0 via-indigo-500/80 to-indigo-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
      
      {/* Top Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="line-clamp-1 font-bold leading-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            {student.student_name}
          </h3>
          <p className="font-mono text-[11px] font-semibold tracking-wider text-indigo-600 dark:text-indigo-400">
            {student.roll_no}
          </p>
        </div>
        <div className="rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-600 dark:text-slate-300">
            {student.tab}
          </span>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="mb-4 space-y-2.5">
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
          <GraduationCap className="h-4 w-4 stroke-[1.5]" />
          <span className="text-xs font-medium">{student.year} Year • {student.course_code}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
          <MapPin className="h-4 w-4 stroke-[1.5]" />
          <span className="text-xs font-medium truncate">{student.department}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
          <User className="h-4 w-4 stroke-[1.5]" />
          <span className="text-xs font-medium truncate">Mentor: {student.mentor_name}</span>
        </div>
      </div>

      {/* Points Summary - High Contrast */}
      <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800/45">
        <div className="rounded-lg py-2.5 text-center">
          <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">Earned</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{student.cumulative_reward_points}</p>
        </div>
        <div className="rounded-lg border-x border-slate-200 py-2.5 text-center dark:border-slate-700">
          <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">Balance</p>
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{student.balance_points}</p>
        </div>
        <div className="rounded-lg py-2.5 text-center">
          <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">Reedemed</p>
          <p className={`text-sm font-black ${isHighPerformer ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400"}`}>
            {student.redeemed_points}
          </p>
        </div>
      </div>
      
      {/* Decorative hover element */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="h-4 w-4 text-indigo-500" />
      </div>
    </article>
  );
}

export default RpCard;