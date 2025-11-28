
import type { Team } from '../types';
import { Shield, DollarSign, Users } from 'lucide-react';

export default function TeamPanel({ team }: { team: Team }) {
  const themes: Record<string, { title: string; border: string; bg: string; badge: string; icon: string }> = {
    cyan: { title: 'text-blue-700', border: 'border-blue-200', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700', icon: 'text-blue-600' },
    pink: { title: 'text-rose-700', border: 'border-rose-200', bg: 'bg-rose-50', badge: 'bg-rose-100 text-rose-700', icon: 'text-rose-600' },
    emerald: { title: 'text-emerald-700', border: 'border-emerald-200', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', icon: 'text-emerald-600' },
    amber: { title: 'text-amber-700', border: 'border-amber-200', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-600' },
  };

  const theme = themes[team.colorTheme] || themes.cyan;

  return (
    <div className={`flex flex-col h-full bg-white rounded-2xl border-2 ${theme.border} shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className={`p-5 ${theme.bg} border-b ${theme.border}`}>
        <div className="flex items-center gap-3 mb-3">
          <Shield className={theme.icon} size={28} />
          <h2 className={`text-xl font-black ${theme.title} truncate`}>{team.name}</h2>
        </div>
        
        {/* Budget */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Budget</span>
          <div className="text-2xl font-mono font-bold text-slate-800 flex items-center">
            <DollarSign size={18} className="text-slate-400 mr-1" />
            {team.budget.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Roster */}
      <div className="flex-1 p-4 flex flex-col bg-white">
        <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1 uppercase">
          <Users size={14} /> Roster ({team.roster.length}/5)
        </h3>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {team.roster.map((player) => (
            <div 
              key={player.id} 
              title={`ID: ${player.ingameName}`} // 마우스 오버 시 인게임 닉네임 표시
              className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors cursor-help"
            >
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
          {/* Empty Slots */}
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