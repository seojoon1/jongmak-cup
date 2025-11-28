import { create } from 'zustand';
import type { Player, Team, GameStatus } from '../types';

interface AuctionState {
  players: Player[];
  teams: Team[];
  waitingList: Player[];
  status: GameStatus;
  currentPlayer: Player | null;
  currentBid: number;
  highBidderId: string | null;
  timerSetting: number;
  currentTime: number;
  
  setPlayers: (players: Player[]) => void;
  setupTeams: (captainIds: string[], captainPositions: Record<string, string>, timerSeconds: number) => void;
  startAuction: () => void;
  placeBid: (teamId: string, amount: number) => void;
  endAuction: (isSold: boolean) => void;
  confirmPosition: (finalPosition: string) => void;
  tickTimer: () => void;
}

const TEAM_COLORS = ['cyan', 'pink', 'emerald', 'amber'] as const;

export const useAuctionStore = create<AuctionState>((set, get) => ({
  players: [],
  teams: [],
  waitingList: [],
  status: 'SETUP',
  currentPlayer: null,
  currentBid: 0,
  highBidderId: null,
  timerSetting: 30,
  currentTime: 30,

  setPlayers: (players) => set({ players }),

  setupTeams: (captainIds, captainPositions, timerSeconds) => {
    const { players } = get();
    const newTeams: Team[] = captainIds.map((capId, idx) => {
      const captain = players.find(p => p.id === capId)!;
      const finalPosition = captainPositions[capId] || captain.position.split(/[\/, ]+/)[0];

      return {
        id: `team-${idx}`,
        name: `${captain.name} TEAM`,
        captainId: capId,
        budget: 1000,
        roster: [{ ...captain, position: finalPosition }],
        colorTheme: TEAM_COLORS[idx % 4] || 'cyan',
      };
    });

    const waitingList = players.filter(p => !captainIds.includes(p.id));
    set({ teams: newTeams, waitingList, timerSetting: timerSeconds, status: 'READY' });
  },

  startAuction: () => {
    const { waitingList, timerSetting } = get();
    if (waitingList.length === 0) return;
    set({
      status: 'BIDDING',
      currentPlayer: waitingList[0],
      currentBid: 0,
      highBidderId: null,
      currentTime: timerSetting,
    });
  },

  placeBid: (teamId, amount) => {
    const { teams, timerSetting } = get();
    const team = teams.find(t => t.id === teamId);
    if (!team || team.roster.length >= 5 || team.budget < amount) return;

    set({
      currentBid: amount,
      highBidderId: teamId,
      currentTime: timerSetting,
    });
  },

  endAuction: (isSold) => {
    const { highBidderId,currentPlayer, waitingList } = get();
    if (!currentPlayer) return;

    if (!isSold || !highBidderId) {
      set({
        waitingList: [...waitingList.slice(1), currentPlayer],
        status: 'READY',
        currentPlayer: null,
        highBidderId: null,
        currentBid: 0
      });
      return;
    }

    const positions = currentPlayer.position.split(/[\/, ]+/).filter(p => p.trim() !== '');
    
    if (positions.length > 1) {
      set({ status: 'SELECTION' }); 
    } else {
      get().confirmPosition(positions[0]);
    }
  },

  confirmPosition: (finalPosition) => {
    const { teams, highBidderId, currentBid, currentPlayer, waitingList } = get();
    if (!highBidderId || !currentPlayer) return;

    const newTeams = teams.map(team => {
      if (team.id === highBidderId) {
        return {
          ...team,
          budget: team.budget - currentBid,
          roster: [...team.roster, { ...currentPlayer, position: finalPosition, cost: currentBid }]
        };
      }
      return team;
    });

    // [로직 추가] 모든 팀이 5명이면 게임 종료
    const isAllFull = newTeams.every(t => t.roster.length >= 5);
    const nextStatus = isAllFull ? 'FINISHED' : 'READY';

    set({
      teams: newTeams,
      waitingList: waitingList.slice(1),
      status: nextStatus, // 종료 체크 반영
      currentPlayer: null,
      highBidderId: null,
      currentBid: 0
    });
  },

  tickTimer: () => {
    const { currentTime, status, endAuction, highBidderId } = get();
    if (status !== 'BIDDING') return;

    if (currentTime > 0) {
      set({ currentTime: currentTime - 1 });
    } else {
      endAuction(!!highBidderId);
    }
  }
}));