import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGameDetails, fetchGameTrailers } from "../../api/game-service";
import { GameDetails, GameTrailer } from "../../interfaces/game-list.interfaces";
import he from "he";

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

  if (loading)
    return (
      <div className="justify-self-center align-self-center min-h-screen bg-base-200 p-4 md:p-8 flex items-center justify-center">
        <span className="loading loading-infinity w-20 h-20 "></span>
      </div>
    );
  if (error) return <p>Error al cargar los detalles del juego</p>;
  if (!gameDetails) return <p>No se encontraron detalles del juego</p>;

  // Function to strip HTML tags from the description
  const stripHtmlTags = (html: string): string => {
    return html.replace(/<[^>]*>/g, "");
  };

  return (
    <div className="animate-fade-in min-h-screen bg-base-200 p-4 md:p-8 flex items-center justify-center">
      <div className="card bg-base-100 shadow-xl w-full max-w-7xl mx-auto">
        {/* Layout principal */}
        <div className="flex flex-col-reverse lg:flex-row-reverse h-full rounded-box overflow-hidden">
          {/* Sección de imagen y videos*/}
          <div className="animate-fade-in lg:w-1/2 flex flex-col border-t lg:border-t-0 lg:border-l border-base-300">
            <div className="flex-1">
              <img
                src={gameDetails.background_image}
                alt={gameDetails.name}
                className="animate-fade-in w-full h-80 lg:h-96 object-cover"
              />
            </div>

            {gameTrailers.length > 0 ? (
              <div className="p-5 bg-base-300 border-t border-base-300 h-1/2 flex flex-col">
                <h2 className="card-title text-xl mb-3">Trailer destacado</h2>
                <div className="rounded-box overflow-hidden shadow-md flex-1">
                  <video controls className="w-full h-full object-cover" poster={gameDetails.background_image}>
                    <source src={gameTrailers[0].data.max} type="video/mp4" />
                    Tu navegador no soporta la reproducción de videos.
                  </video>
                  {gameTrailers.length > 1 && (
                    <p className="text-sm mt-3 text-center text-base-content/70">
                      +{gameTrailers.length - 1} trailers adicionales disponibles
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-5 bg-base-300 border-t border-base-300 h-1/2 flex items-center justify-center">
                <p className="text-center text-base-content/70">No hay trailers disponibles para este juego</p>
              </div>
            )}
          </div>

          {/* Sección de información */}
          <div className="card-body lg:w-1/2 p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-3">
              <h1 className="card-title text-3xl font-bold">{gameDetails.name}</h1>
              {gameDetails.metacritic && (
                <div
                  className={`badge badge-lg ${
                    gameDetails.metacritic > 75
                      ? "badge-success"
                      : gameDetails.metacritic > 60
                      ? "badge-warning"
                      : "badge-error"
                  }`}>
                  {gameDetails.metacritic}
                </div>
              )}
            </div>

            {/* Géneros */}
            <div className="flex flex-wrap gap-2 mb-5">
              {gameDetails.genres.map((genre) => (
                <div className="badge badge-outline badge-lg">{genre.name}</div>
              ))}
            </div>

            {/* Información clave */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="stat bg-base-200 rounded-box p-3">
                <div className="stat-title text-lg">Fecha de lanzamiento</div>
                <div className="stat-value text-primary text-xl">{gameDetails.released}</div>
              </div>

              <div className="stat bg-base-200 rounded-box p-3">
                <div className="stat-title text-lg">Valoración</div>
                <div className="stat-value text-secondary text-xl">{gameDetails.rating}</div>
                <div className="stat-desc text-base">
                  de {gameDetails.rating_top} • {gameDetails.ratings_count} valoraciones
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <h3 className="font-semibold text-xl mb-3">Sobre el juego</h3>
              <div className="bg-base-200 rounded-lg p-4 max-h-52 overflow-y-auto">
                <p className="leading-relaxed text-base-content/90 text-base">
                  {he.decode(stripHtmlTags(gameDetails.description))}
                </p>
              </div>
            </div>

            {/* Sección de plataformas */}
            <div className="mb-6">
              <h3 className="font-semibold text-xl mb-2">Plataformas disponibles</h3>
              <div className="flex flex-wrap gap-2">
                {gameDetails.platforms.map((p) => (
                  <span className="badge badge-neutral badge-md">{p.platform.name}</span>
                ))}
              </div>
            </div>

            {/* Boton*/}
            <div className="card-actions justify-center flex mt-4 pt-4 border-t border-base-300">
              <button onClick={() => window.history.back()} className="btn btn-primary btn-wide">
                Volver a la galería
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
