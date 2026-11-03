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

/** En Uzun DK Kadrosu · worldcuptallest (FIFA squad PDF, boy) */
export type WorldCupHeightPlayer = {
  position: string;
  height_cm: number;
  name: string;
  surname: string;
};

export type WorldCupTallest = {
  id: number;
  country: string;
  players: WorldCupHeightPlayer[];
  created_at: string;
  updated_at: string;
};

/** En Kısa DK Kadrosu · worldcupshortest */
export type WorldCupShortest = {
  id: number;
  country: string;
  players: WorldCupHeightPlayer[];
  created_at: string;
  updated_at: string;
};

export type WorldCupSquadCountryEntry = {
  id: number;
  country: string;
  players: WorldCupYoungestPlayer[];
};

/** En Uzun Kadro · tallestsquad (ülke · güncel / tüm zamanlar) */
export type TallestSquadPlayer = {
  position: string;
  name: string;
  surname: string;
  height_cm: number;
};

export type TallestSquadEra = "current" | "all_time";

export type TallestSquad = {
  id: number;
  country: string;
  era: TallestSquadEra;
  players: TallestSquadPlayer[];
  created_at: string;
  updated_at: string;
};

export type TallestSquadCountryEntry = {
  id: number;
  country: string;
  players: TallestSquadPlayer[];
};

/** Güncel kulüp · tallest_current (Transfermarkt) */
export type TallestCurrentPlayer = TallestSquadPlayer;

export type TallestCurrent = {
  id: number;
  team: string;
  players: TallestCurrentPlayer[];
  created_at: string;
  updated_at: string;
};
