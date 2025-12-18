import { useState } from 'react';
import { useAuctionStore } from '../store/auctionStore';
import { User, Timer, Gavel, XCircle, List, Coins } from 'lucide-react';
import PlayerListModal from './PlayerListModal';
import ToEng from './ToEng';
import type { ChampionKoreanName } from './ToEng';

export default function AuctionBidding() {
  const { 
    currentPlayer, currentBid, highBidderId, 
    currentTime, teams,
    placeBid, endAuction, grantSubsidy
  } = useAuctionStore();

  const highBidderTeam = teams.find(t => t.id === highBidderId);
  const [bidStep, setBidStep] = useState(100);
  const [showPlayerList, setShowPlayerList] = useState(false);

  const getChampionBG = (championName: string) => {
    const formattedName = ToEng[championName as ChampionKoreanName];
    if (!formattedName) return '';
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${formattedName}_0.jpg`;
  };

  if (!currentPlayer) return <div className="flex-1"></div>;

  return (
    // 전체 컨테이너: 중앙 정렬 및 너비 제한 (max-w-5xl)
    <div className="flex-1 w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col p-6 relative overflow-hidden h-full">
      
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* 목록 보기 버튼 */}
      <div className="absolute top-5 right-5 z-20">
        <button 
          onClick={() => setShowPlayerList(true)}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
          title="선수 명단"
        >
          <List size={20} />
        </button>
      </div>

      {/* [상단 영역] 경매 정보 (선수 프로필 + 현황판) */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-6 flex-shrink-0 pt-2">
        
        {/* 1. 선수 프로필 */}
        <div className="flex flex-col items-center">
            <div className="relative mb-3 group">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-100 shadow-md flex items-center justify-center overflow-hidden"
                aria-describedby="player-profile-tooltip"
                >
                    {currentPlayer.mostChampions ? (
                        <div className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${getChampionBG(currentPlayer.mostChampions)})` }} 
                        />
                    ) : (
                        <User size={48} className="text-slate-300" />
                    )}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-slate-800 rounded-full text-xs font-bold text-white shadow border border-white whitespace-nowrap">
                    {currentPlayer.position}
                </div>
            <div
                id="player-profile-tooltip"
                role="tooltip"
                className="
                pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full
                px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap
                opacity-0 group-hover:opacity-100 transition-opacity duration-150
                "
            >
                {currentPlayer.notes || '선수에 대한 추가 정보가 없습니다.'}
            </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-1">{currentPlayer.name}</h1>
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 border px-2 py-0.5 rounded">{currentPlayer.tier}</span>
                <span className="text-xs text-slate-500 font-mono">{currentPlayer.ingameName}</span>
                <span className="text-xs text-slate-500 font-mono">{currentPlayer.mostAllChampions}</span>
            </div>
        </div>

        {/* 구분선 (PC 화면에서만 보임) */}
        <div className="hidden md:block w-px h-32 bg-slate-200"></div>

        {/* 2. 경매 현황 (현재가, 타이머, 입찰단위) */}
        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[320px]">
            <div className="grid grid-cols-2 gap-3">
                {/* 현재가 */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex flex-col justify-center items-center relative overflow-hidden h-24 shadow-sm">
                    {highBidderTeam && (
                        <div className={`absolute top-0 left-0 w-2 h-full bg-${highBidderTeam.colorTheme}-500`} />
                    )}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Bid</span>
                    <div className={`text-3xl font-mono font-black ${highBidderTeam ? 'text-indigo-600' : 'text-slate-300'}`}>
                        {currentBid.toLocaleString()}
                    </div>
                    <div className="text-xs font-bold text-slate-600 bg-white px-2 rounded-full shadow-sm border border-slate-100 truncate max-w-[120px] max-h-[50px]"
                        title={highBidderTeam ? highBidderTeam.name : ''}>
                        {highBidderTeam ? highBidderTeam.name : '-'}
                    </div>
                </div>

                {/* 타이머 */}
                <div className={`rounded-2xl border flex flex-col justify-center items-center shadow-sm h-24 ${currentTime <= 5 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                    <div className={`text-4xl font-mono font-black flex items-center gap-2 ${currentTime <= 5 ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
                        <Timer size={28} className="opacity-50" /> {currentTime}
                    </div>
                </div>
            </div>

            {/* 입찰 단위 */}
            <div className="h-10 flex bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm">
                <div className="px-4 bg-slate-50 flex items-center text-xs font-bold text-slate-500 border-r whitespace-nowrap">입찰 단위</div>
                <input 
                    type="number" 
                    value={bidStep}
                    onChange={(e) => setBidStep(Number(e.target.value))}
                    className="w-full px-4 font-mono font-bold text-center text-lg focus:outline-none"
                    onFocus={(e) => e.target.select()}
                />
            </div>
        </div>
      </div>

      {/* [하단 영역] 팀 리스트 (카드 형태, 2x2 그리드) */}
      <div className="flex-1 overflow-y-auto min-h-0 mb-4 pr-2 scrollbar-thin">
        <div className="grid grid-cols-2 gap-4 h-full content-start">
            {teams.map(team => {
                const isFull = team.roster.length >= 5;
                const isHighBidder = team.id === highBidderId;
                const canBid = !isFull && team.budget >= currentBid + bidStep && !isHighBidder;
                
                // 팀별 색상 테마
                const btnStyles: Record<string, string> = {
                    cyan: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
                    pink: 'bg-rose-50 border-rose-200 hover:bg-rose-100',
                    emerald: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
                    amber: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
                };

                // 상태별 스타일
                const disabledStyle = 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed';
                const highBidderStyle = 'bg-slate-800 border-yellow-400 ring-4 ring-yellow-400/30 text-white';

                return (
                    <button
                        key={team.id}
                        onClick={() => placeBid(team.id, currentBid + bidStep)}
                        disabled={!canBid}
                        className={`
                            relative rounded-2xl border-2 p-4 transition-all flex flex-col text-left shadow-sm group min-h-[180px]
                            ${isHighBidder ? highBidderStyle : canBid ? btnStyles[team.colorTheme] : disabledStyle}
                            ${canBid && !isHighBidder ? 'active:scale-[0.98] hover:shadow-md' : ''}
                        `}
                    >
                        {/* 카드 헤더: 팀명 & 예산 */}
                        <div className="flex justify-between items-center w-full mb-3">
                            <div className="flex items-center gap-2">
                                {isHighBidder && <span className="text-lg">👑</span>}
                                <span className={`font-black text-lg truncate ${isHighBidder ? 'text-yellow-400' : 'text-slate-800'}`}>
                                    {team.name}
                                </span>
                            </div>
                            <span className={`font-mono font-bold text-sm px-2 py-1 rounded ${isHighBidder ? 'bg-white/20 text-white' : 'bg-white/60 text-slate-600'}`}>
                                {team.budget} P
                            </span>
                        </div>

                        {/* 로스터 리스트 (카드 내부) */}
                        <div className={`flex-1 w-full rounded-xl p-2 space-y-1 mb-3 overflow-y-auto ${isHighBidder ? 'bg-white/10' : 'bg-white/60'}`}>
                            {team.roster.map(p => (
                                <div key={p.id} className={`text-xs flex justify-between font-medium ${isHighBidder ? 'text-white/90' : 'text-slate-600'}`}>
                                    <span>{p.name}</span>
                                    <span className="opacity-70">{p.position}</span>
                                </div>
                            ))}
                            {/* 빈 슬롯 표시 (5개 채우기) */}
                            {Array.from({length: Math.max(0, 5 - team.roster.length)}).map((_, i) => (
                                <div key={`empty-${i}`} className={`h-4 border-b border-dashed ${isHighBidder ? 'border-white/20' : 'border-slate-300'}`}></div>
                            ))}
                        </div>

                        {/* 하단 액션 텍스트 */}
                        <div className="w-full text-center mt-auto">
                            <span className={`text-xl font-black ${isHighBidder ? 'text-yellow-400 animate-pulse' : isFull ? 'text-red-500' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                {isHighBidder ? "현재 입찰 중!" : isFull ? "ROSTER FULL" : `+ ${bidStep} 입찰하기`}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
      </div>

      {/* 하단 관리자 컨트롤 */}
      <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 flex-shrink-0 bg-white">
        <button 
            onClick={() => {
                if(window.confirm('인원이 부족한 팀에게 200P를 지급하시겠습니까?')) {
                    grantSubsidy(200);
                }
            }}
            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors text-xs border border-emerald-200"
        >
            <Coins size={14} /> 미완성 팀 지원금 지급 (+200P)
        </button>

        <div className="flex gap-3">
            <button 
                onClick={() => endAuction(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
            >
                <XCircle size={18} /> 유찰
            </button>
            <button 
                onClick={() => endAuction(true)}
                disabled={!highBidderId}
                className="flex-[2] py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            >
                <Gavel size={18} /> 낙찰 확정
            </button>
        </div>
      </div>

      {showPlayerList && (
        <PlayerListModal 
            onClose={() => setShowPlayerList(false)} 
        />
      )}
    </div>
  );
}