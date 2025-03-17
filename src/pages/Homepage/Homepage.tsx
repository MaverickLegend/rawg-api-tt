import { GameFiltersBar } from "../../components/GameFiltersBar/GameFiltersBar";
import { GameList } from "../../components/GameList/GameList";
import "./Homepage.scss";

export const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className="title">
        <h1>RAWG API Exercise</h1>
      </div>
      <div className="main-container">
        {/* Componente de filtros */}
        <GameFiltersBar />

        {/* Componente de lista de juegos */}
        <GameList />
      </div>
    </div>
  );
};
