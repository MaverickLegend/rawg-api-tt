import { useEffect, useState } from "react";
// import { GameFiltersOptions } from "../../interfaces/game-list.interfaces";
import { rawgApi } from "../../api/rawg-api";
import { Button } from "../common/Button/Button";
import "./GameFiltersBar.scss";
import { Loader } from "../common/Loader/Loader";
import { useGameStore } from "../../store/useGameStore";
import { platformsList } from ".";
import { GameFiltersOptions } from "../../interfaces/game-list.interfaces";

interface Option {
  id: number;
  name: string;
  slug: string;
}

export const GameFiltersBar = () => {
  const { filters, setFilters } = useGameStore();
  const [genres, setGenres] = useState<Option[]>([]);
  const [platforms, setPlatforms] = useState<Option[]>([]);
  const [tags, setTags] = useState<Option[]>([]);
  const [developers, setDevelopers] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  const [localSearch, setLocalSearch] = useState(filters.search || "");

  useEffect(() => {
    setLocalSearch(filters.search || "");
  }, [filters.search]);

  // Create an array of years from 1989 to the current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

  // Function to handle the form submission and call the onChange function with the new filters
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Actualiza los filtros globales con la búsqueda local
    setFilters({ ...filters, search: localSearch || undefined });
  };

  const handleClearFilters = () => {
    setLocalSearch("");
    setFilters({}); // Limpia todos los filtros
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Async fetch genres, platforms, tags and developers from the RAWG API
      const [genresData, platformsData, tagsData, devsData] = await Promise.all([
        rawgApi.get("/genres"),
        rawgApi.get("/platforms"),
        rawgApi.get("/tags"),
        rawgApi.get("/developers"),
      ]);
      // Set the state with the fetched data
      setGenres(genresData.data.results);
      setPlatforms(platformsData.data.results);
      setTags(tagsData.data.results);
      setDevelopers(devsData.data.results);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Loader className="tiny" />;

  return (
    <div className="game-filters-bar">
      <form className="filters" onSubmit={handleSubmit}>
        <div className="input-group">
          {/* Filtro de año */}
          <label>
            Año:
            <select
              value={filters.dates?.split("-")[0] || ""}
              onChange={(e) => {
                const year = e.target.value;
                const dateRange = year ? `${year}-01-01,${year}-12-31` : undefined;
                setFilters({ ...filters, dates: dateRange });
              }}>
              <option value="">Todos</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          {/* Filtro de género */}
          <label>
            Género:
            <select
              value={filters.genres || ""}
              onChange={(e) => setFilters({ ...filters, genres: e.target.value || undefined })}>
              <option value="">Todos</option>
              {genres.map((g) => (
                <option key={g.id} value={g.slug}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>

          {/* Filtro de plataforma */}
          <label>
            Plataforma:
            <select
              value={filters.platforms || ""}
              onChange={(e) => setFilters({ ...filters, platforms: e.target.value || undefined })}>
              <option value="">Todas</option>
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {/* Filtro de etiqueta */}
          <label>
            Etiqueta:
            <select
              value={filters.tags || ""}
              onChange={(e) => setFilters({ ...filters, tags: e.target.value || undefined })}>
              <option value="">Todas</option>
              {tags.map((t) => (
                <option key={t.id} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>

          {/* Filtro de desarrolladores */}
          <label>
            Desarrolladores:
            <select
              value={filters.developers || ""}
              onChange={(e) => setFilters({ ...filters, developers: e.target.value || undefined })}>
              <option value="">Todas</option>
              {developers.map((d) => (
                <option key={d.id} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>

          {/* Búsqueda */}
          <label>
            Buscar:
            <input type="text" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} />
          </label>
        </div>

        {/* Botones */}
        <div className="button-group">
          <Button onClick={() => handleSubmit} className="no-spacing">
            Buscar
          </Button>

          <Button onClick={handleClearFilters} className="no-spacing">
            Limpiar filtros
          </Button>
        </div>
      </form>
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
  );
};
