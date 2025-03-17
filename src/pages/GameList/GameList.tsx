import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "./GameList.scss";
import { Game, GameFiltersOptions } from "../../interfaces/game-list.interfaces";
import { fetchGames } from "../../api/game-service";
import { Button } from "../../components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import { GameFiltersBar } from "../../components/GameFiltersBar/GameFiltersBar";
import { Loader } from "../../components/common/Loader/Loader";
import { platformsList } from ".";

export const GameList = () => {
  const [gameList, setGameList] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<GameFiltersOptions>({});
  const [totalResults, setTotalResults] = useState<number>(0);
  const navigate = useNavigate();

  const handleViewDetails = (gameId: number) => {
    navigate(`/game/${gameId}`);
  };

  // Fetch games on first render and when currentPage or filters change

  useEffect(() => {
    const getGames = async () => {
      try {
        setLoading(true);
        const hasFilters = Object.keys(filters).length > 0;
        const { games, count } = hasFilters
          ? await fetchGames(currentPage, filters)
          : await fetchGames(currentPage, {});
        setGameList(games);
        setTotalResults(count);
      } catch (error) {
        toast.error("Error fetching games");
        console.log(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getGames();
  }, [currentPage, filters]);

  if (loading) return <Loader />;
  if (error)
    return (
      <>
        <p>{error}</p>
        <Button onClick={() => window.history.go(0)}>Recargar</Button>
      </>
    );

  const pageSize = 12;
  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <>
      <div className="game-list-container">
        <h1>RAWG API Excercise</h1>

        {/* Component to apply filters */}
        <div className="game-list-header">
          <GameFiltersBar
            filters={filters}
            onChange={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(1);
            }}
          />
          {/* Display applied filters */}
          <div className="game-filters">
            <h3>Filtros aplicados:</h3>
            <div className="filters-list">
              {/* Render filters */}
              {Object.keys(filters).map((filter) => (
                // Add a key prop to the span element
                <span key={filter} className="filter-tag">
                  {filter === "dates" && filters[filter]
                    ? // Add a check for the dates filter and split the string to get the year
                      filters[filter]?.split(",")[0]?.split("-")[0]
                    : filter === "platforms" && filters[filter]
                    ? // Add a check for the platforms filter and find the platform name by id
                      platformsList.find((platform) => platform.id === Number(filters[filter]))?.slug
                    : filters[filter as keyof GameFiltersOptions]}{" "}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="game-list">
          {/* Render games list with pagination */}
          {gameList.map((game, indexInPage) => {
            const index = (currentPage - 1) * pageSize + indexInPage + 1;
            return (
              <li key={game.id}>
                <h5>{index}</h5>
                <div className="game-info">
                  <h4>{game.name}</h4>
                  <p>Puntuación Metacritic: {game.metacritic}</p>
                </div>
                <Button onClick={() => handleViewDetails(game.id)}>{"Detalles"}</Button>
              </li>
            );
          })}
        </div>
        <div className="pagination">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="no-spacing"
            disabled={currentPage === 1}>
            {"<"}
          </Button>
          <span>{currentPage}</span>
          <Button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="no-spacing"
            disabled={currentPage >= totalPages}>
            {">"}
          </Button>
        </div>
      </div>
    </>
  );
};
