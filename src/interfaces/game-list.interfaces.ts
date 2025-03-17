interface Game {
  id: number;
  name: string;
  metacritic: number;
}

interface GameListProps {
  games: Game[];
}

interface GameDetails extends Game {
  description: string;
  background_image: string;
  released: string;
  rating: number;
  rating_top: number;
  genres: { name: string }[];
  platforms: { platform: { name: string } }[];
  trailers?: { data: { max: string } }[];
}

interface GameTrailer {
  id: number;
  name: string;
  preview: string;
  data: {
    max: string;
  };
}

interface GameFiltersOptions {
  genres?: string;
  platforms?: string;
  tags?: string;
  developers?: string;
  dates?: string;
  search?: string;
}

export type { Game, GameDetails, GameListProps, GameFiltersOptions, GameTrailer };
