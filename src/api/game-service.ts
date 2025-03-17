// Code to fetch games, game details and game trailers from the RAWG API

import { Game, GameDetails, GameFiltersOptions, GameTrailer } from "../interfaces/game-list.interfaces";
import { rawgApi } from "./rawg-api";

export const fetchGames = async (
  currentPage: number,
  filters: GameFiltersOptions
): Promise<{ games: Game[]; count: number }> => {
  try {
    const { data } = await rawgApi.get("/games", {
      params: {
        page_size: 12,
        page: currentPage,
        ordering: "-metacritic",
        ...filters,
      },
    });
    return { games: data.results, count: data.count };
  } catch (error) {
    console.error("Error fetching filtered games:", error);
    throw error;
  }
};

export const fetchGameDetails = async (gameId: number): Promise<GameDetails> => {
  try {
    const { data } = await rawgApi.get(`/games/${gameId}`);
    return data;
  } catch (error) {
    console.error("Error fetching game details:", error);
    throw error;
  }
};

export const fetchGameTrailers = async (gameId: number): Promise<GameTrailer[]> => {
  try {
    const { data } = await rawgApi.get(`/games/${gameId}/movies`);
    return data.results;
  } catch (error) {
    console.error("Error fetching game trailers:", error);
    throw error;
  }
};
