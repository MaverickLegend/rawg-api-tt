import { create } from "zustand";
import { Game, GameFiltersOptions } from "../interfaces/game-list.interfaces";
import { fetchGames } from "../api/game-service";
import toast from "react-hot-toast";

interface GameStoreState {
  gameList: Game[];
  loading: boolean;
  error: boolean;
  currentPage: number;
  filters: GameFiltersOptions;
  totalResults: number;
  setGameList: (games: Game[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
  setCurrentPage: (page: number) => void;
  setFilters: (filters: GameFiltersOptions) => void;
  setTotalResults: (total: number) => void;
  fetchGames: () => Promise<void>;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  gameList: [],
  loading: true,
  error: false,
  currentPage: 1,
  filters: {},
  totalResults: 0,

  // Setters

  setGameList: (games) => set({ gameList: games }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setFilters: (filters) => set({ filters, currentPage: 1 }),
  setTotalResults: (total) => set({ totalResults: total }),

  // Methods

  fetchGames: async () => {
    const { currentPage, filters } = get();
    try {
      get().setLoading(true);
      const hasFilters = Object.keys(filters).length > 0;
      const { games, count } = hasFilters ? await fetchGames(currentPage, filters) : await fetchGames(currentPage, {});
      get().setGameList(games);
      get().setTotalResults(count);
    } catch (error) {
      toast.error("Error fetching games");
      console.log(error);
      get().setError(true);
    } finally {
      get().setLoading(false);
    }
  },
}));
