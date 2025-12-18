import { useState } from 'react';
import { useAuctionStore } from '../store/auctionStore';
import { fetchPlayersFromSheet } from '../services/googleSheet';
import { Upload, Check, Users, PlayCircle } from 'lucide-react';

export default function SetupScreen() {
  const { setPlayers, players, setupTeams } = useAuctionStore();
  const [sheetUrl, setSheetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCaptains, setSelectedCaptains] = useState<string[]>([]);
  const [captainPositions, setCaptainPositions] = useState<Record<string, string>>({});
  const [timer, setTimer] = useState(30);

  const maxTeams = Math.min(Math.floor(players.length / 5));

  const handleLoadSheet = async () => {
    if (!sheetUrl) return;
    setLoading(true);
    const data = await fetchPlayersFromSheet(sheetUrl);
    setPlayers(data);
    setLoading(false);
  };

  const toggleCaptain = (player: any) => {
    const id = player.id;
    if (selectedCaptains.includes(id)) {
      setSelectedCaptains(prev => prev.filter(c => c !== id));
      const newPos = { ...captainPositions };
      delete newPos[id];
      setCaptainPositions(newPos);
    } else {
      if (selectedCaptains.length < maxTeams) {
        setSelectedCaptains(prev => [...prev, id]);
        
        // 기본 포지션 설정 (첫번째 것)
        const possiblePositions = player.position.split(/[\/, ]+/).filter((p: string) => p.trim() !== '');
        setCaptainPositions(prev => ({
          ...prev,
          [id]: possiblePositions[0]
        }));
      } else {
        alert(`최대 ${maxTeams}팀까지만 가능합니다.`);
      }
    }
  };

  const updateCaptainPosition = (id: string, pos: string) => {
    setCaptainPositions(prev => ({ ...prev, [id]: pos }));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-10 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-5xl space-y-8">
        
        <header className="text-center space-y-2">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Civil war CUP SETUP
          </h1>
          <a href="https://www.notion.so/2bc4a41f5933809fbcc6f5d6f3504eae?source=copy_link" className='text-gray-400' target='_blank'> -사용 설명서-</a>
          <p className="text-gray-400">구글 시트 연동 및 팀장 설정을 진행해주세요.</p>
        </header>

        {/* 1. 구글 시트 로드 */}
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <label className="block text-sm text-gray-400 mb-2 font-bold">1. Google Sheet Link</label>
          <div className="flex gap-3">
            <input 
              type="text" 
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
            <button 
              onClick={handleLoadSheet}
              disabled={loading}
              className="bg-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Loading...' : <><Upload size={20}/> Load</>}
            </button>
          </div>
        </div>

        {players.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            {/* 2. 팀장 선택 */}
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 h-[500px] flex flex-col">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-400">
                <Users size={20}/> 2. 팀장 선택 ({selectedCaptains.length}/{maxTeams})
              </h2>
              <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 gap-2 content-start">
                {players.map(p => {
                  const isSelected = selectedCaptains.includes(p.id);
                  const positions = p.position.split(/[\/, ]+/).filter(pos => pos.trim() !== '');
                  const isMultiPos = positions.length > 1;

                  return (
                    <div 
                      key={p.id}
                      className={`p-3 rounded-lg border transition-all
                        ${isSelected
                          ? 'bg-green-600/20 border-green-500' 
                          : 'bg-gray-700/30 border-transparent hover:bg-gray-700'}`}
                    >
                      <div 
                        onClick={() => toggleCaptain(p)}
                        className="flex justify-between items-center cursor-pointer"
                      >
                        <div>
                          <div className={`font-bold ${isSelected ? 'text-green-100' : 'text-white'}`}>{p.name}</div>
                          <div className="text-[10px] text-gray-400">{p.ingameName}</div>
                        </div>
                        <div className="flex items-center gap-2">
                           {!isSelected && <span className="text-xs bg-black/30 px-2 py-1 rounded text-gray-400">{p.position}</span>}
                           {isSelected && <Check size={18} className="text-green-400"/>}
                        </div>
                      </div>

                      {isSelected && isMultiPos && (
                        <div className="mt-3 pt-3 border-t border-green-500/30 flex items-center justify-between animate-fadeIn">
                            <span className="text-xs text-green-300 font-bold">포지션 선택:</span>
                            <div className="flex gap-1">
                                {positions.map(pos => (
                                    <button
                                        key={pos}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            updateCaptainPosition(p.id, pos);
                                        }}
                                        className={`px-3 py-1 rounded text-xs font-bold transition-colors border
                                            ${captainPositions[p.id] === pos 
                                                ? 'bg-green-500 text-white border-green-400' 
                                                : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700'
                                            }`}
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. 옵션 및 시작 */}
            <div className="flex flex-col gap-6">
              <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                <h2 className="text-xl font-bold mb-4">3. 설정</h2>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">경매 시간 (초)</label>
                  <input 
                    type="number" 
                    value={timer}
                    onChange={(e) => setTimer(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white font-mono text-xl"
                  />
                </div>
              </div>

              <button 
                onClick={() => setupTeams(selectedCaptains, captainPositions, timer)}
                disabled={selectedCaptains.length < 2}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-black text-2xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
              >
                <PlayCircle size={32} /> START
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}