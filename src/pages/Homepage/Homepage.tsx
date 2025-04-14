import { GameFiltersBar } from "../../components/GameFiltersBar/GameFiltersBar";
import { GameList } from "../../components/GameList/GameList";

export const HomePage = () => {
return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4">
    <h1 className="text-base-content text-4xl font-bold pb-4 text-center">RAWG API Exercise</h1>

    {/* Contenedor con ancho fijo y altura mínima */}
    <div className="w-full max-w-5xl min-h-[60vh] bg-base-100 rounded-box shadow-md p-4 transition-all">
      <GameFiltersBar />
      <div className="divider" />
      <GameList />
    </div>
  </div>
);
};
