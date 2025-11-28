import { useState, useMemo } from 'react';
import { List, Search, X, Shield, Check } from 'lucide-react';
import { useAuctionStore } from '../store/auctionStore';

interface Props {
  onClose: () => void;
  waitingList?: any[]; 
}

export default function PlayerListModal({ onClose }: Props) {
    const { players, teams } = useAuctionStore(); 
    const [filter, setFilter] = useState('');

    const takenPlayersMap = useMemo(() => {
        const map = new Map();
        teams.forEach(team => {
            team.roster.forEach(player => {
                map.set(player.id, { 
                    teamName: team.name, 
                    colorTheme: team.colorTheme 
                });
            });
        });
        return map;
    }, [teams]); // teams가 바뀔 때만 갱신됨 (확실한 반응형)

    // 검색 필터
    const filteredList = players.filter(p => 
        p.name.includes(filter) || 
        p.ingameName.includes(filter) ||
        p.position.includes(filter.toUpperCase())
    );

    return (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full h-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn border border-slate-200">
                {/* 헤더 */}
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                        <List size={20} className="text-indigo-600"/> 
                        전체 선수 명단 ({players.length})
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500"/>
                    </button>
                </div>
                
                {/* 검색창 */}
                <div className="p-3 border-b bg-white">
                    <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2.5 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                        <Search size={18} className="text-slate-400 mr-3"/>
                        <input 
                            type="text" 
                            placeholder="이름, 닉네임, 포지션 검색..." 
                            className="bg-transparent text-sm w-full focus:outline-none font-medium text-slate-700"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                </div>

                {/* 리스트 영역 */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-50/50">
                    {filteredList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                            <Search size={40} className="mb-2 opacity-20"/>
                            <span className="text-sm">검색 결과가 없습니다.</span>
                        </div>
                    ) : (
                        filteredList.map(player => {
                            // [수정] 위에서 만든 족보(Map)에서 즉시 조회 (오류 가능성 0%)
                            const takenInfo = takenPlayersMap.get(player.id);
                            const isTaken = !!takenInfo;

                            // 뱃지 스타일
                            const badgeColors: Record<string, string> = {
                                cyan: 'bg-blue-100 text-blue-700 border-blue-200',
                                pink: 'bg-rose-100 text-rose-700 border-rose-200',
                                emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                                amber: 'bg-amber-100 text-amber-700 border-amber-200',
                            };
                            const badgeClass = isTaken ? badgeColors[takenInfo.colorTheme] : 'bg-slate-100 text-slate-500';

                            return (
                                <div 
                                    key={player.id} 
                                    className={`
                                        flex justify-between items-center p-3 rounded-xl border transition-all
                                        ${isTaken 
                                            ? 'bg-slate-100 border-slate-200 opacity-60 grayscale-[0.5]' 
                                            : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`
                                            text-[10px] font-black w-10 text-center py-1 rounded-md border
                                            ${isTaken ? 'bg-slate-200 text-slate-500 border-slate-300' : 'bg-white text-slate-700 border-slate-200 shadow-sm'}
                                        `}>
                                            {player.position.split(/[\/, ]+/)[0]}
                                        </span>
                                        
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-bold ${isTaken ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-800'}`}>
                                                    {player.name}
                                                </span>
                                                {isTaken && <CheckCircleIcon />}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-mono">{player.ingameName}</div>
                                        </div>
                                    </div>

                                    {/* 상태 표시 */}
                                    {isTaken ? (
                                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border ${badgeClass}`}>
                                            <Shield size={10} />
                                            <span className="truncate max-w-[80px]">{takenInfo.teamName}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-bold text-slate-400 border border-slate-200 bg-slate-50 px-2 py-1 rounded-lg">
                                            {player.tier}
                                        </span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

function CheckCircleIcon() {
    return (
        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={10} className="text-white stroke-[3]" />
        </div>
    );
}