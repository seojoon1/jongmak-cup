import { useEffect } from 'react';
import { useAuctionStore } from './store/auctionStore';
import SetupScreen from './components/SetupScreen';
// import TeamPanel from './components/TeamPanel';
import AuctionStage from './components/AuctionStage';
import { Trophy } from 'lucide-react';
export default function App() {
  const { status, teams, tickTimer, resetAuction } = useAuctionStore();

  useEffect(() => {
    const interval = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(interval);
  }, [tickTimer]);

  if (status === 'SETUP') {
    return <SetupScreen />;
  }

  // const half = Math.ceil(teams.length / 2);
  // const leftTeams = teams.slice(0, half);
  // const rightTeams = teams.slice(half);

  return (
    <div className="h-screen bg-slate-50 text-slate-900 flex overflow-hidden p-6 gap-6 font-sans">
      
      {/* Left Column */}
      {/* <div className="w-[340px] flex flex-col gap-6 z-10">
        {leftTeams.map(team => (
          <div key={team.id} className="flex-1 min-h-0 drop-shadow-sm">
             <TeamPanel team={team} />
          </div>
        ))}
      </div> */}

      {/* Center Stage */}
      <main className="flex-1 flex flex-col z-10 min-w-0">
        <header className="h-16 flex items-center justify-between px-8 mb-4 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Trophy size={20} onClick={resetAuction}/>
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">2025 종막컵</h1>
                <span className="text-xs text-slate-500 font-medium tracking-widest">JONGMAK CUP AUCTION</span>
              </div>
            </div>
            
            <div className="flex gap-6 text-sm font-medium text-slate-500">
                <span className="px-3 py-1 bg-slate-100 rounded-full">상태: {status}</span>
                <span className="px-3 py-1 bg-slate-100 rounded-full">참가 팀: {teams.length}팀</span>
            </div>
        </header>
        <AuctionStage />
      </main>

      {/* Right Column */}
      {/* <div className="w-[340px] flex flex-col gap-6 z-10">
         {rightTeams.map(team => (
          <div key={team.id} className="flex-1 min-h-0 drop-shadow-sm">
             <TeamPanel team={team} />
          </div>
        ))}
      </div> */}
    </div>
  );
}