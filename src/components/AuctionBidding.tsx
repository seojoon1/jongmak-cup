import React, { useState } from 'react';
import { useAuctionStore } from '../store/auctionStore';
import { User, Timer, Gavel, XCircle, List } from 'lucide-react';
import PlayerListModal from './PlayerListModal';

export default function AuctionBidding() {
  const { 
    currentPlayer, currentBid, highBidderId, 
    currentTime, teams, waitingList,
    placeBid, endAuction 
  } = useAuctionStore();

  const highBidderTeam = teams.find(t => t.id === highBidderId);
  const [bidStep, setBidStep] = useState(10);
  const [showPlayerList, setShowPlayerList] = useState(false);

  if (!currentPlayer) return <div className="flex-1"></div>;

  return (
    <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col p-4 relative overflow-hidden h-full max-h-full">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* 목록 버튼 */}
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={() => setShowPlayerList(true)}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
        >
          <List size={20} />
        </button>
      </div>

      {/* 프로필 */}
      <div className="flex flex-col items-center justify-center mt-2 mb-2 flex-shrink-0">
         <div className="relative mb-2">
            <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-100 shadow-md flex items-center justify-center overflow-hidden">
               <User size={48} className="text-slate-300" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-slate-800 rounded-full text-xs font-bold text-white shadow border border-white">
              {currentPlayer.position}
            </div>
         </div>
         <h1 className="text-3xl font-black text-slate-900 mb-1">{currentPlayer.name}</h1>
         <div className="px-3 py-0.5 bg-slate-100 rounded text-slate-500 font-mono text-xs mb-1">
            ID: {currentPlayer.ingameName}
         </div>
         <span className="text-xs font-bold text-slate-400 border px-2 rounded">{currentPlayer.tier}</span>
      </div>

      {/* 현황판 */}
      <div className="grid grid-cols-[1.2fr_0.8fr] gap-3 mb-3 flex-shrink-0">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col justify-center items-center relative overflow-hidden">
           {highBidderTeam && (
             <div className={`absolute top-0 left-0 w-1.5 h-full bg-${highBidderTeam.colorTheme}-500`} />
           )}
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Bid</span>
           <div className={`text-4xl font-mono font-black ${highBidderTeam ? 'text-indigo-600' : 'text-slate-300'}`}>
             {currentBid.toLocaleString()}
           </div>
           <div className="text-xs font-bold text-slate-600 mt-1">
             {highBidderTeam ? highBidderTeam.name : '-'}
           </div>
        </div>

        <div className="flex flex-col gap-2">
            <div className={`flex-1 rounded-xl border flex flex-col justify-center items-center ${currentTime <= 5 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`text-3xl font-mono font-black flex items-center gap-2 ${currentTime <= 5 ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
                    <Timer size={24} className="opacity-50" /> {currentTime}
                </div>
            </div>
            <div className="h-10 flex bg-white rounded-lg border border-slate-300 overflow-hidden">
                <div className="px-2 bg-slate-100 flex items-center text-xs font-bold text-slate-500 border-r">단위</div>
                <input 
                    type="number" 
                    value={bidStep}
                    onChange={(e) => setBidStep(Number(e.target.value))}
                    className="w-full px-2 font-mono font-bold text-center focus:outline-none"
                    onFocus={(e) => e.target.select()}
                />
            </div>
        </div>
      </div>

      {/* 팀 리스트 */}
      <div className="flex-1 overflow-y-auto min-h-0 mb-3 pr-1 scrollbar-thin">
        <div className="grid grid-cols-2 gap-2">
            {teams.map(team => {
            const isFull = team.roster.length >= 5;
            const canBid = !isFull && team.budget >= currentBid + bidStep;
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
                    onClick={() => placeBid(team.id, currentBid + bidStep)}
                    disabled={!canBid}
                    className={`
                    relative h-14 rounded-lg transition-all flex items-center px-3 justify-between
                    shadow-sm active:scale-[0.98]
                    ${canBid 
                        ? `${btnStyles[team.colorTheme]} text-white` 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}
                    ${isHighBidder ? 'ring-2 ring-offset-1' : ''}
                    `}
                >
                    <div className="flex flex-col items-start truncate">
                        <span className={`text-[10px] font-bold truncate max-w-[80px] ${canBid ? 'text-white/80' : 'text-slate-400'}`}>
                            {team.name}
                        </span>
                        <span className="text-lg font-black leading-none">
                            {isFull ? 'FULL' : `+ ${bidStep}`}
                        </span>
                    </div>
                    <div className="text-right">
                        <div className={`text-[10px] font-mono font-medium px-1.5 rounded mb-0.5 ${canBid ? 'bg-black/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {team.budget}
                        </div>
                    </div>
                </button>
            );
            })}
        </div>
      </div>

      {/* 컨트롤 버튼 */}
      <div className="flex gap-2 pt-3 border-t border-slate-100 flex-shrink-0">
        <button 
            onClick={() => endAuction(false)}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors text-sm"
        >
            <XCircle size={18} /> 유찰
        </button>
        <button 
            onClick={() => endAuction(true)}
            disabled={!highBidderId}
            className="flex-[2] py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
            <Gavel size={18} /> 낙찰 확정
        </button>
      </div>

      {showPlayerList && (
        <PlayerListModal 
            waitingList={waitingList} 
            onClose={() => setShowPlayerList(false)} 
        />
      )}
    </div>
  );
}