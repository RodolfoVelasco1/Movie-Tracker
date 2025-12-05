export interface Genre {
    id: number;
    name: string;
}

export interface Movie {
    id: number;
    title: string;
    summary: string;
    duration: number;
    imageUrl: string;
    status: 'TO_WATCH' | 'IN_PROGRESS' | 'COMPLETED';
    genres: Genre[];
}

export interface Series {
    id: number;
    title: string;
    summary: string;
    duration: number;
    imageUrl: string;
    episodes?: number;
    status: 'TO_WATCH' | 'IN_PROGRESS' | 'COMPLETED';
    genres: Genre[];
}