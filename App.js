import React, { useEffect, useState } from 'react';
import PokemonCard from './components/PokemonCard';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const allTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const data = await res.json();
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return {
              id: details.id,
              name: details.name,
              image: details.sprites.front_default,
              types: details.types.map((type) => type.type.name)
            };
          })
        );
        setPokemonList(pokemonDetails);
        setFilteredPokemon(pokemonDetails);
      } catch (err) {
        setError('Failed to load Pokémon.');
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, []);

  useEffect(() => {
    let filtered = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (typeFilter) {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.includes(typeFilter)
      );
    }
    setFilteredPokemon(filtered);
  }, [searchTerm, typeFilter, pokemonList]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="App">
      <header>
        <h1>Pokémon Search</h1>
      </header>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        types={allTypes}
      />
      <div className="pokemon-grid">
        {filteredPokemon.length > 0 ? (
          filteredPokemon.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))
        ) : (
          <p>No Pokémon found!</p>
        )}
      </div>
    </div>
  );
}

export default App;