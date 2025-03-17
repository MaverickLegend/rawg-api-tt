import { useEffect, useState } from "react";
import { GameFiltersOptions } from "../../interfaces/game-list.interfaces";
import { rawgApi } from "../../api/rawg-api";
import { Button } from "../common/Button/Button";
import "./GameFiltersBar.scss";
import { Loader } from "../common/Loader/Loader";

interface Option {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  filters: GameFiltersOptions;
  onChange: (filters: GameFiltersOptions) => void;
}

export const GameFiltersBar = ({ filters, onChange }: Props) => {
  const [genres, setGenres] = useState<Option[]>([]);
  const [platforms, setPlatforms] = useState<Option[]>([]);
  const [tags, setTags] = useState<Option[]>([]);
  const [developers, setDevelopers] = useState<Option[]>([]);
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [loading, setLoading] = useState(true);

  // Create an array of years from 1989 to the current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

  // Function to handle the form submission and call the onChange function with the new filters
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters: GameFiltersOptions = {
      ...filters,
      search: localSearch || undefined,
    };
    onChange(newFilters);
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
    <form className="filters" onSubmit={(e) => handleSubmit(e)}>
      <div className="input-group">
        {/* Input groups and search */}

        <label>
          Año:
          <select
            value={filters.dates?.split("-")[0] || ""}
            onChange={(e) => {
              const year = e.target.value;
              const dateRange = year ? `${year}-01-01,${year}-12-31` : undefined;
              onChange({ ...filters, dates: dateRange });
            }}>
            <option value="">Todos</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label>
          Género:
          <select
            value={filters.genres || ""}
            onChange={(e) => onChange({ ...filters, genres: e.target.value || undefined })}>
            <option value="">Todos</option>
            {genres.map((g) => (
              <option key={g.id} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Plataforma:
          <select
            value={filters.platforms || ""}
            onChange={(e) => onChange({ ...filters, platforms: e.target.value || undefined })}>
            <option value="">Todas</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Etiqueta:
          <select
            value={filters.tags || ""}
            onChange={(e) => onChange({ ...filters, tags: e.target.value || undefined })}>
            <option value="">Todas</option>
            {tags.map((t) => (
              <option key={t.id} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Desarrolladores:
          <select
            value={filters.developers || ""}
            onChange={(e) => onChange({ ...filters, developers: e.target.value || undefined })}>
            <option value="">Todas</option>
            {developers.map((d) => (
              <option key={d.id} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Buscar:
          <input type="text" value={localSearch || ""} onChange={(e) => setLocalSearch(e.target.value)} />
        </label>
      </div>

      {/* Buttons */}

      <div className="button-group">
        <Button onClick={() => handleSubmit} className="no-spacing">
          Buscar
        </Button>

        <Button
          onClick={() => {
            setLocalSearch("");
            onChange({});
          }}
          className="no-spacing">
          Limpiar filtros
        </Button>
      </div>
    </form>
  );
};
