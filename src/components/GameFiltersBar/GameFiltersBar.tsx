import { useEffect, useState } from "react";
import { rawgApi } from "../../api/rawg-api";
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

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== "");


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
  <div className="animate-fade-in animate-fade-out w-full mx-auto p-4 md:p-6 bg-base-100 rounded-box shadow-md">
    <form className="" onSubmit={handleSubmit}>
      {/* Grid responsive  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
        {/* Filtro de año */}
        <label className="select w-full">
          <span className="label text text-base-content">Fecha de lanzamiento:</span>
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

        {/* Filtro de género  */}
        <label className="select w-full">
          <span className="label text text-base-content">Género:</span>
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
        <label className="select w-full">
          <span className="label text text-base-content">Plataforma:</span>
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
        <label className="select w-full">
          <span className="label text text-base-content">Etiqueta:</span>
          <select
            className="text"
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

        {/* Búsqueda  */}
        <div className=" join w-full">
          <label className="input join-item w-full ">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              className="text text-base-content"
              type="search"
              placeholder="Search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </label>
          <button onClick={() => handleSubmit} className="btn btn-soft join-item">
            Buscar
          </button>
        </div>

        {/* Filtro de desarrolladores */}
        <label className="select w-full">
          <span className="label text text-base-content">Desarrollador:</span>
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
      </div>

      {/* Botones  */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
        {/* <button onClick={() => handleSubmit} className="btn btn-soft btn-neutral">
          Buscar
        </button> */}
        {hasActiveFilters && (
          <button onClick={handleClearFilters} className="btn btn-soft btn-secondary">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Filtros aplicados (responsive) */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {Object.keys(filters)
          .filter((key): key is keyof GameFiltersOptions => Boolean(filters[key as keyof GameFiltersOptions]))
          .map((filter) => (
            <button
              key={filter}
              className="badge badge-secondary cursor-pointer"
              onClick={() => setFilters({ ...filters, [filter]: undefined })}>
              {filter === "dates" && filters[filter]
                ? filters[filter]?.split(",")[0]?.split("-")[0]
                : filter === "platforms" && filters[filter]
                ? platformsList.find((p) => p.id === Number(filters[filter]))?.slug
                : filters[filter as keyof GameFiltersOptions]?.toUpperCase()}{" "}
              ✕
            </button>
          ))}
      </div>
    </form>
  </div>
);
};
