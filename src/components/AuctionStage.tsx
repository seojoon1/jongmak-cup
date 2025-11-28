
import { useAuctionStore } from '../store/auctionStore';
import { User, Timer, Gavel, XCircle, CheckCircle } from 'lucide-react';

export default function AuctionStage() {
  const { 
    currentPlayer, currentBid, highBidderId, 
    currentTime, status, teams, waitingList,
    placeBid, startAuction, endAuction, confirmPosition 
  } = useAuctionStore();

  const highBidderTeam = teams.find(t => t.id === highBidderId);

  // --- 1. 대기 화면 (READY) ---
  if (status === 'READY') {
    return (
      <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center justify-center p-10 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
          <User size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">다음 선수를 기다리는 중</h2>
        <p className="text-slate-500 mb-8 font-medium">
          대기 1순위: <span className="text-indigo-600 font-bold">{waitingList[0]?.name || '없음'}</span>
        </p>
        <button 
          onClick={startAuction}
          disabled={waitingList.length === 0}
          className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
        >
          경매 시작하기
        </button>
      </div>
    );
  }

  // --- 2. 포지션 선택 화면 (SELECTION) ---
  if (status === 'SELECTION' && currentPlayer && highBidderTeam) {
    const possiblePositions = currentPlayer.position.split(/[\/, ]+/).filter(p => p.trim() !== '');

    return (
      <div className="flex-1 bg-white rounded-3xl shadow-xl border-4 border-indigo-500 flex flex-col items-center justify-center p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-50/50 z-0"/>
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-3xl font-black text-slate-800 mb-4">포지션 결정 (Position Select)</h2>
          <p className="text-lg text-slate-600 mb-8 text-center">
            <span className="font-bold text-indigo-600">{highBidderTeam.name}</span> 팀장님,<br/>
            <span className="font-bold">{currentPlayer.name}</span> 선수를 어느 라인에 배치하시겠습니까?
          </p>
          
          <div className="flex gap-4">
            {possiblePositions.map((pos) => (
              <button
                key={pos}
                onClick={() => confirmPosition(pos)}
                className="w-32 h-32 bg-white border-2 border-indigo-200 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group"
              >
                <span className="text-2xl font-black">{pos}</span>
                <CheckCircle size={24} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 3. 경매 진행 중 화면 (BIDDING) ---
  if (!currentPlayer) return <div className="flex-1"></div>;

  return (
    <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col p-8 relative overflow-hidden">
      
      {/* 상단 장식 */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* 선수 프로필 */}
      <div className="flex flex-col items-center justify-center py-4">
         <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full bg-white border-4 border-slate-100 shadow-xl flex items-center justify-center overflow-hidden">
               <User size={64} className="text-slate-300" />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-800 rounded-full text-sm font-bold text-white shadow-lg border-2 border-white">
              {currentPlayer.position}
            </div>
         </div>
         <h1 className="text-5xl font-black text-slate-900 mb-2">{currentPlayer.name}</h1>
         
         <div className="mb-3 px-4 py-1 bg-slate-100 rounded-lg border border-slate-200 text-slate-500 font-mono text-sm">
            ID: <span className="font-bold text-slate-700">{currentPlayer.ingameName}</span>
         </div>

         <div className="flex gap-2">
           <span className="px-3 py-1 bg-slate-50 text-slate-500 font-bold rounded-lg text-xs border border-slate-200">
             {currentPlayer.tier}
           </span>
         </div>
      </div>

      {/* 현황판 */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-center items-center relative overflow-hidden">
           {highBidderTeam && (
             <div className={`absolute top-0 left-0 w-2 h-full bg-${highBidderTeam.colorTheme}-500`} />
           )}
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Bid</span>
           <div className={`text-6xl font-mono font-black ${highBidderTeam ? 'text-indigo-600' : 'text-slate-300'}`}>
             {currentBid.toLocaleString()}
           </div>
           <div className="mt-2 text-sm font-bold text-slate-600 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
             {highBidderTeam ? `${highBidderTeam.name} 입찰 중` : '입찰 대기 중'}
           </div>
        </div>

        <div className={`rounded-2xl p-6 border flex flex-col justify-center items-center transition-colors duration-300
            ${currentTime <= 5 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
           <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${currentTime <= 5 ? 'text-red-500' : 'text-slate-400'}`}>Time Left</span>
           <div className={`text-6xl font-mono font-black flex items-center gap-2 ${currentTime <= 5 ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
              <Timer size={48} className="opacity-50" />
              {currentTime}
           </div>
        </div>
      </div>

      {/* 컨트롤 버튼들 */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {teams.map(team => {
          const isFull = team.roster.length >= 5;
          const canBid = !isFull && team.budget >= currentBid + 10;
          const isHighBidder = team.id === highBidderId;
          
          const btnStyles: Record<string, string> = {
            cyan: 'bg-blue-600 hover:bg-blue-700 ring-blue-200',
            pink: 'bg-rose-600 hover:bg-rose-700 ring-rose-200',
            emerald: 'bg-emerald-600 hover:bg-emerald-700 ring-emerald-200',
            amber: 'bg-amber-600 hover:bg-amber-700 ring-amber-200',
          };
          
          return (
            <button
                key={team.id}
                onClick={() => placeBid(team.id, currentBid + 10)}
                disabled={!canBid}
                className={`
                  relative h-20 rounded-xl transition-all flex items-center px-6 justify-between
                  shadow-md active:scale-[0.98] active:shadow-sm
                  ${canBid 
                    ? `${btnStyles[team.colorTheme]} text-white` 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}
                  ${isHighBidder ? 'ring-4 ring-offset-2' : ''}
                `}
            >
                <div className="flex flex-col items-start">
                  <span className={`text-xs font-bold ${canBid ? 'text-white/80' : 'text-slate-400'}`}>
                    {team.name}
                  </span>
                  <span className="text-2xl font-black">
                    {isFull ? 'FULL' : '+ 10'}
                  </span>
                </div>
                
                <div className="text-right">
                    <div className={`text-xs font-mono font-medium py-1 px-2 rounded mb-1 ${canBid ? 'bg-black/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {team.budget} P
                    </div>
                    <div className="text-[10px] font-bold">
                        {team.roster.length}/5
                    </div>
                </div>
            </button>
          );
        })}
      </div>

      {/* 관리자 버튼 */}
      <div className="flex gap-4 mt-6 pt-6 border-t border-slate-100">
        <button 
            onClick={() => endAuction(false)}
            className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
            <XCircle size={20} /> 유찰 (PASS)
        </button>
        <button 
            onClick={() => endAuction(true)}
            disabled={!highBidderId}
            className="flex-[2] py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
        >
            <Gavel size={20} /> 낙찰 확정 (SOLD)
        </button>
      </div>
    </div>
  );
}