export type Position = string;

export interface Player {
    id: string;//아이디
    ingameName: string;//인겜닉
    name: string;//닉네임
    tier: string;//티어
    position: Position;//포지션
    mostChampions: string //모스트1
    mostAllChampions?: string; // 주챔 전체 리스트
    cost?: number; // 낙찰가
    notes?: string; // 비고
}

export interface Team {
    id: string;
    name: string;
    captainId: string;
    budget: number;
    roster: Player[];
    colorTheme: 'cyan' | 'pink' | 'emerald' | 'amber';
}

export type GameStatus = 'SETUP' | 'READY' | 'BIDDING' | 'PAUSED' | 'FINISHED'|'SELECTION';