import type { Team } from '../types';
import { Shield, DollarSign, Users, CheckCircle } from 'lucide-react';

export default function TeamPanel({ team }: { team: Team }) {
  // 팀 정원이 꽉 찼는지 확인
  const isFull = team.roster.length >= 5;

  const themes: Record<string, { title: string; border: string; bg: string; badge: string; icon: string }> = {
    cyan: { title: 'text-blue-700', border: 'border-blue-200', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700', icon: 'text-blue-600' },
    pink: { title: 'text-rose-700', border: 'border-rose-200', bg: 'bg-rose-50', badge: 'bg-rose-100 text-rose-700', icon: 'text-rose-600' },
    emerald: { title: 'text-emerald-700', border: 'border-emerald-200', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', icon: 'text-emerald-600' },
    amber: { title: 'text-amber-700', border: 'border-amber-200', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-600' },
  };

  const theme = themes[team.colorTheme] || themes.cyan;

  return (
    <div className={`
      relative flex flex-col h-full bg-white rounded-2xl border-2 shadow-lg overflow-hidden transition-all duration-500
      ${theme.border}
      ${isFull ? 'opacity-60 grayscale scale-[0.98]' : 'opacity-100 scale-100'} 
    `}>
      
      {/* [효과] 5명이 꽉 찼을 때 나타나는 완료 오버레이 */}
      {isFull && (
        <div className="absolute inset-0 z-20 bg-black/5 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-slate-800/90 text-white px-6 py-2 rounded-xl border-2 border-white/20 shadow-2xl backdrop-blur-md transform -rotate-12 flex items-center gap-2">
             <CheckCircle size={24} className="text-green-400" />
             <span className="text-xl font-black tracking-widest">ROSTER FULL</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`p-5 ${theme.bg} border-b ${theme.border}`}>
        <div className="flex items-center gap-3 mb-3">
          <Shield className={theme.icon} size={28} />
          <h2 className={`text-xl font-black ${theme.title} truncate`}>{team.name}</h2>
        </div>
        
        {/* Budget Card */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Budget</span>
          <div className="text-2xl font-mono font-bold text-slate-800 flex items-center">
            <DollarSign size={18} className="text-slate-400 mr-1" />
            {team.budget.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Roster List */}
      <div className="flex-1 p-4 flex flex-col bg-white">
        <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1 uppercase">
          <Users size={14} /> Roster ({team.roster.length}/5)
        </h3>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {team.roster.map((player) => (
            <div key={player.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] w-10 text-center py-1 rounded font-bold ${theme.badge}`}>
                  {player.position}
                </span>
                <span className="font-bold text-slate-700">{player.name}</span>
              </div>
              {player.cost && (
                <span className="text-sm font-mono font-bold text-slate-400">{player.cost} P</span>
              )}
            </div>
          ))}
          {/* 빈 슬롯 표시 */}
          {[...Array(Math.max(0, 5 - team.roster.length))].map((_, i) => (
             <div key={i} className="h-10 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-xs font-medium text-slate-300">
               빈 슬롯
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}