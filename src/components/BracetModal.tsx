import { useState, useEffect } from 'react';
import { Swords, X } from 'lucide-react';
import type { Team } from '../types'; // Team 타입이 정의된 곳에서 import (없으면 any로 대체 가능)

type Matchup = {
    team1: Team;
    team2: Team | null;
};

interface BracketModalProps {
    teams: Team[];
    onClose: () => void;
}

export default function BracketModal({ teams, onClose }: BracketModalProps) {
    const [matchups, setMatchups] = useState<Matchup[]>([]);

    // 대진표 생성 함수
    const generateBracket = () => {
        // 1. 팀 랜덤 섞기 (Fisher-Yates Shuffle)
        const shuffled = [...teams];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // 2. 매칭 생성
        const newMatchups: Matchup[] = [];
        for (let i = 0; i < shuffled.length; i += 2) {
            newMatchups.push({
                team1: shuffled[i],
                team2: shuffled[i + 1] || null // 홀수라서 짝이 없으면 null (부전승)
            });
        }

        setMatchups(newMatchups);
    };

    // 컴포넌트 마운트 시 자동으로 1회 생성
    useEffect(() => {
        generateBracket();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* 헤더 */}
                <div className="bg-slate-900 p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Swords className="text-yellow-400" /> 랜덤 대진표 결과
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                {/* 대진표 내용 */}
                <div className="p-8 space-y-6 bg-slate-50 max-h-[60vh] overflow-y-auto">
                    {matchups.map((match, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-center text-sm font-bold text-slate-400 mb-3">MATCH {idx + 1}</div>
                            <div className="flex items-center justify-between gap-4">
                                {/* 블루팀 */}
                                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="font-black text-lg text-blue-900">{match.team1.name}</div>
                                    <div className="text-xs text-blue-600 font-bold">BLUE SIDE</div>
                                </div>

                                <div className="font-black text-slate-300 text-xl">VS</div>

                                {/* 레드팀 (또는 부전승) */}
                                {match.team2 ? (
                                    <div className="flex-1 text-center p-3 bg-red-50 rounded-lg border border-red-100">
                                        <div className="font-black text-lg text-red-900">{match.team2.name}</div>
                                        <div className="text-xs text-red-600 font-bold">RED SIDE</div>
                                    </div>
                                ) : (
                                    <div className="flex-1 text-center p-3 bg-slate-100 rounded-lg border border-slate-200 border-dashed">
                                        <div className="font-black text-lg text-slate-500">부전승 (Bye)</div>
                                        <div className="text-xs text-slate-400">다음 라운드 진출</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 하단 버튼 */}
                <div className="p-4 bg-white border-t border-slate-100 flex justify-center">
                    <button 
                        onClick={generateBracket}
                        className="px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                        🔄 다시 추첨하기
                    </button>
                </div>
            </div>
        </div>
    );
}