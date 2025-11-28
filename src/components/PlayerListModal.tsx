    import React, { useState } from 'react';
import { List, Search, X } from 'lucide-react';
import type { Player } from '../types';

interface Props {
  waitingList: Player[];
  onClose: () => void;
}

export default function PlayerListModal({ waitingList, onClose }: Props) {
    const [filter, setFilter] = useState('');

    const filteredList = waitingList.filter(p => 
        p.name.includes(filter) || p.position.includes(filter.toUpperCase())
    );

    return (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full h-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <List size={18}/> 남은 선수 ({waitingList.length})
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full">
                        <X size={20} className="text-slate-500"/>
                    </button>
                </div>
                
                <div className="p-2 border-b">
                    <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2">
                        <Search size={16} className="text-slate-400 mr-2"/>
                        <input 
                            type="text" 
                            placeholder="이름, 포지션 검색..." 
                            className="bg-transparent text-sm w-full focus:outline-none"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredList.length === 0 ? (
                        <div className="text-center text-slate-400 py-10 text-sm">검색 결과가 없습니다.</div>
                    ) : (
                        filteredList.map(player => (
                            <div key={player.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold w-10 text-center bg-slate-200 text-slate-600 rounded px-1 py-0.5">
                                        {player.position.split(/[\/, ]+/)[0]}
                                    </span>
                                    <div>
                                        <div className="text-sm font-bold text-slate-700">{player.name}</div>
                                        <div className="text-[10px] text-slate-400">{player.ingameName}</div>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 border px-1.5 rounded">{player.tier}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}