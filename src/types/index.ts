export type Position = string;

export interface Player {
    id: string;
    ingameName: string;
    name: string;
    tier: string;
    position: Position;
    cost?: number; // 낙찰가
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