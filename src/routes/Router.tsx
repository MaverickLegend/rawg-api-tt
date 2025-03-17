import { Route, Routes } from "react-router-dom";
// import { GameList } from "../pages/GameList/GameList";
import { GameDetailsPage } from "../pages/GameDetail/GameDetailsPage";
import { HomePage } from "../pages/Homepage/Homepage";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/game/:id" element={<GameDetailsPage />} />
    </Routes>
  );
};

export { Router };
