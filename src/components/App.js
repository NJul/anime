import React, { useEffect, useState } from 'react';
import './App.css';
import { AnimeList } from './AnimeList';

function App() {
  const [search, setSearch] = useState('fairy');
  const [animeData, setAnimeData] = useState();

  const getData = async () => {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${search}&limit=10`
    );
    const resData = await res.json();
    setAnimeData(resData.data);
  };

  useEffect(() => {
    getData();
  }, [search]);

  return (
    <>
      <div className='header'>
        <h1>My Anime List</h1>
        <div className='search-box'>
          <input
            type='search'
            placeholder='Search your anime'
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className='container'>
        <div className='animeInfo'></div>

        <div className='anime-row'>
          <h2 className='text-heading'>Anime</h2>
          <div className='row'>
            <AnimeList animelist={animeData} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
