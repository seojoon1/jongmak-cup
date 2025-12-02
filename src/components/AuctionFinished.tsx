import {useRef, useState} from 'react';
import { Trophy, Download, Swords, } from 'lucide-react';
import { useAuctionStore } from '../store/auctionStore';
import {toPng} from 'html-to-image';
import BracketModal from './BracetModal';

export default function AuctionFinished() {
    const { teams } = useAuctionStore();
    const captureRef = useRef<HTMLDivElement>(null);
    const [showBraket, setShowBracket] = useState(false);

    const handleCapture = async () => {
        if (!captureRef.current) return;
        try{
            const dataUrl = await toPng(captureRef.current, {backgroundColor: "ffffff"});

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `auction_results_${new Date().getTime()}.png`;
            link.click();
    }
        catch (error) {
            console.error('이미지 저장 실패:', error);
        }
    };
    return (
    <div 
    ref ={captureRef}
    className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
        {/* 폭죽 효과 배경 */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-50/50 to-white pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
            <div className="w-28 h-28 bg-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-200 animate-bounce">
                <Trophy size={56} className="text-white drop-shadow-md" />
            </div>
            
            <h1 className="text-4xl font-black text-slate-800 mb-2">AUCTION COMPLETE!</h1>
            <p className="text-xl text-slate-500 mb-8">모든 팀의 로스터 구성이 완료되었습니다.</p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl text-left">
                {teams.map(team => (
                    <div key={team.id} className={`p-4 rounded-xl border border-slate-200 bg-slate-50`}>
                        <div className="font-bold text-lg mb-2 flex justify-between">
                            <span>{team.name}</span>
                            <span className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600">남은 예산: {team.budget}</span>
                        </div>
                        <div className="space-y-1">
                            {team.roster.map(p => (
                                <div key={p.id} className="text-sm text-slate-600 flex justify-between">
                                    <span>{p.name} ({p.position},{p.tier})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={handleCapture}
                data-html2canvas-ignore="true"
                className="mt-8 px-8 py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl flex items-center gap-2 transition-transform active:scale-95"
            >
                <Download size={20} /> 결과 저장 (이미지 저장)
            </button>
            <button 
                onClick={()=>setShowBracket(true)}
                disabled={teams.length < 3}
                data-html2canvas-ignore="true"
                className={`
                px-6 py-3 font-bold rounded-xl flex items-center gap-2 transition-all
                ${teams.length >= 3
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 shadow-lg shadow-indigo-200' // [활성] 보라색 + 그림자 + 클릭 효과
                : 'bg-slate-200 text-slate-400 cursor-not-allowed' // [비활성] 회색 배경 + 흐린 글씨 + 금지 커서
                }
                `}                
            >
                <Swords size={20} /> 대진표 생성
            </button>

        </div>
        {showBraket && <BracketModal teams={teams} onClose={() => setShowBracket(false)} />}
    </div>
    );
}