import { useEffect } from "react";
import { Button } from "../common/Button/Button";
import { useGameStore } from "../../store/useGameStore";
import { useNavigate } from "react-router-dom";

export const GameList = () => {
  const { gameList, loading, error, totalResults, fetchGames, currentPage, setCurrentPage, filters } = useGameStore();
  const navigate = useNavigate();

  const handleViewDetails = (gameId: number) => {
    navigate(`/game/${gameId}`);
  };

  useEffect(() => {
    fetchGames();
  }, [currentPage, filters]);

  const pageSize = 12;
  const totalPages = Math.ceil(totalResults / pageSize);

  if (loading)
    return (
      <div className="justify-self-center align-self-center  md:p-8 flex items-center justify-center">
        <span className="loading loading-infinity w-20 h-20 "></span>
      </div>
    );
  if (error)
    return (
      <>
        <p>Error al cargar los juegos</p>
        <Button onClick={() => window.location.reload()}>Recargar</Button>
      </>
    );

return (
  <ul className="animate-fade-in list bg-base-100 rounded-box shadow-md p-4">
    {/* Grid responsive manteniendo tu estilo */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {gameList.map((game, indexInPage) => {
        const index = (currentPage - 1) * pageSize + indexInPage + 1;
        return (
          <li key={game.id} className="list-row p-3 hover:bg-base-200 rounded-lg transition-colors">
            <h5 className="text-lg font-medium">{index}</h5>
            <div className="game-info">
              <h4 className="text-base font-semibold text-base-content">{game.name}</h4>
              <p className="text-sm">Metacritic: {game.metacritic}</p>
            </div>
            <button className="btn btn-neutral btn-sm" onClick={() => handleViewDetails(game.id)}>
              Detalles
            </button>
          </li>
        );
      })}
    </div>

    {/* Paginación igual pero centrada */}
    <div className="join mx-auto p-3 gap-2 mt-4">
      <button
        className="join-item btn btn-soft btn-primary"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}>
        {"<"}
      </button>
      <span className="join-item btn btn-active btn-primary">{currentPage}</span>
      <button
        className="join-item btn btn-soft btn-primary"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage >= totalPages}>
        {">"}
      </button>
    </div>
  </ul>
);
};
