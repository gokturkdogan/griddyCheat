export type Cheat = {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
};

/** En Genç Kadro · worldcupyoungest */
export type WorldCupYoungestPlayer = {
  position: string;
  age: number;
  name: string;
  surname: string;
};

export type WorldCupYoungest = {
  id: number;
  country: string;
  players: WorldCupYoungestPlayer[];
  created_at: string;
  updated_at: string;
};

/** En Yaşlı Kadro · oldestworldcup (aynı oyuncu şeması) */
export type OldestWorldCupPlayer = WorldCupYoungestPlayer;

export type OldestWorldCup = {
  id: number;
  country: string;
  players: OldestWorldCupPlayer[];
  created_at: string;
  updated_at: string;
};

export type WorldCupSquadCountryEntry = {
  id: number;
  country: string;
  players: WorldCupYoungestPlayer[];
};
