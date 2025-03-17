import { Route, Routes } from "react-router-dom";
import { GameList } from "../pages/GameList/GameList";
import { GameDetailsPage } from "../pages/GameDetail/GameDetailsPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<GameList />} />
      <Route path="/game/:id" element={<GameDetailsPage />} />
    </Routes>
  );
};

export { Router };
