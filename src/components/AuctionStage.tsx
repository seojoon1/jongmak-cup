import React, { useState } from 'react';
import { useAuctionStore } from '../store/auctionStore';
import { User, CheckCircle, List } from 'lucide-react';
import PlayerListModal from './PlayerListModal';
import AuctionBidding from './AuctionBidding';
import AuctionFinished from './AuctionFinished';

export default function AuctionStage() {
  const { 
    currentPlayer, highBidderId, status, waitingList, teams, // teams 추가됨
    startAuction, confirmPosition 
  } = useAuctionStore();

  const [showPlayerList, setShowPlayerList] = useState(false);
  const highBidderTeam = teams.find(t => t.id === highBidderId);

  if (status === 'FINISHED') {
    return <AuctionFinished />;
  }

  if (status === 'READY') {
    return (
      <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <User size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">다음 선수를 기다리는 중</h2>
        <p className="text-slate-500 mb-6 font-medium">
          대기 1순위: <span className="text-indigo-600 font-bold">{waitingList[0]?.name || '없음'}</span>
        </p>
        <div className="flex gap-3">
            <button 
            onClick={() => setShowPlayerList(true)}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-2"
            >
            <List size={20}/> 명단 확인
            </button>
            <button 
            onClick={startAuction}
            disabled={waitingList.length === 0}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
            >
            경매 시작
            </button>
        </div>
        {showPlayerList && <PlayerListModal waitingList={waitingList} onClose={() => setShowPlayerList(false)} />}
      </div>
    );
  }

  if (status === 'SELECTION' && currentPlayer && highBidderTeam) {
    const possiblePositions = currentPlayer.position.split(/[\/, ]+/).filter(p => p.trim() !== '');
    return (
      <div className="flex-1 bg-white rounded-3xl shadow-xl border-4 border-indigo-500 flex flex-col items-center justify-center p-10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-3xl font-black text-slate-800 mb-4">포지션 결정</h2>
          <p className="text-lg text-slate-600 mb-8 text-center">
            <span className="font-bold text-indigo-600">{highBidderTeam.name}</span> 팀장님,<br/>
            <span className="font-bold">{currentPlayer.name}</span> 선수를 어디로 보낼까요?
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

  return <AuctionBidding />;
}