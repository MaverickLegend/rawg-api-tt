import { useEffect } from "react";
import { Button } from "../common/Button/Button";
import { Loader } from "../common/Loader/Loader";
import { useGameStore } from "../../store/useGameStore";
import { useNavigate } from "react-router-dom";
import "./GameList.scss";

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

  if (loading) return <Loader />;
  if (error)
    return (
      <>
        <p>Error al cargar los juegos</p>
        <Button onClick={() => window.location.reload()}>Recargar</Button>
      </>
    );

  return (
    <div className="game-list-container">
      {/* Renderizar la lista de juegos */}
      <div className="game-list">
        {gameList.map((game, indexInPage) => {
          const index = (currentPage - 1) * pageSize + indexInPage + 1;
          return (
            <li key={game.id}>
              <h5>{index}</h5>
              <div className="game-info">
                <h4>{game.name}</h4>
                <p>Metacritic: {game.metacritic}</p>
              </div>
              <Button onClick={() => handleViewDetails(game.id)}>{"Detalles"}</Button>
            </li>
          );
        })}
      </div>

      {/* Paginación */}
      <div className="pagination">
        <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          {"<"}
        </Button>
        <span>{currentPage}</span>
        <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages}>
          {">"}
        </Button>
      </div>
    </div>
  );
};
