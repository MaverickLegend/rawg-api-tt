import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGameDetails, fetchGameTrailers } from "../../api/game-service";
import { GameDetails, GameTrailer } from "../../interfaces/game-list.interfaces";
import "./GameDetailsPage.scss";
import { Button } from "../../components/common/Button/Button";
import he from "he";
import { Loader } from "../../components/common/Loader/Loader";

export const GameDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [gameTrailers, setGameTrailers] = useState<GameTrailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch game details and trailers on first render and when gameDetails.id changes

  useEffect(() => {
    const getGameDetails = async () => {
      try {
        const details = await fetchGameDetails(Number(id));
        const gameTrailers = await fetchGameTrailers(Number(id));
        setGameDetails(details);
        setGameTrailers(gameTrailers);
      } catch (error) {
        console.error("Error fetching game details:", error);
        setError(true);
      } finally {
        setLoading(false);
        console.log(gameDetails?.id);
      }
    };
    getGameDetails();
  }, [id, gameDetails?.id]);

  if (loading) return <Loader />;
  if (error) return <p>Error al cargar los detalles del juego</p>;
  if (!gameDetails) return <p>No se encontraron detalles del juego</p>;

  // Function to strip HTML tags from the description
  const stripHtmlTags = (html: string): string => {
    return html.replace(/<[^>]*>/g, "");
  };

  return (
    <div className="game-details-container">
      <div className="card card-container">
        <div className="details-container">
          <div className="title-container">
            <h1>{gameDetails.name}</h1>
          </div>
          <div className="description-container">
            <p>{he.decode(stripHtmlTags(gameDetails.description))}</p>
          </div>
          <div className="info-container">
            <div className="info">
              <h5>Fecha de lanzamiento</h5>
              <p>{gameDetails.released}</p>
            </div>
            <div className="info">
              <h5>Puntuación</h5>
              <p>{gameDetails.rating}</p>
            </div>
            <div className="info">
              <h5>Puntuación máxima</h5>
              <p>{gameDetails.rating_top}</p>
            </div>
            <div className="info">
              <h5>Metacritic</h5>
              <p>{gameDetails.metacritic}</p>
            </div>
            <div className="info">
              <h5>Plataformas</h5>
              <p>{gameDetails.platforms.map((p) => p.platform.name).join(", ")}</p>
            </div>
            <div className="info">
              <h5>Géneros</h5>
              <p>{gameDetails.genres.map((g) => g.name).join(", ")}</p>
            </div>
          </div>
          <Button onClick={() => window.history.back()}>{"Volver"}</Button>
        </div>
        <div className="media-container">
          <div className="image-container">
            <img src={gameDetails.background_image} alt={gameDetails.name} />
          </div>
          <div className="video-container">
            {gameTrailers.length > 0 ? (
              <div className="trailers">
                {gameTrailers.map((trailer) => (
                  <div key={trailer.id}>
                    <video controls>
                      <source src={trailer.preview} type="video/mp4" />
                      <source src={trailer.data.max} type="video/mp4" />
                    </video>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay trailers disponibles para este juego.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
