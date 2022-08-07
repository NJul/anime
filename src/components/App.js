import React, { useEffect, useState } from 'react';
import { AnimeList } from './AnimeList';
import { AnimeInfo } from './AnimeInfo';
import './App.css';

function App() {
  const [search, setSearch] = useState('fairy');
  const [animeData, setAnimeData] = useState();
  const [animeInfo, setAnimeInfo] = useState();

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
        <div className='animeInfo'>
          {animeInfo && <AnimeInfo animeInfo={animeInfo} />}
        </div>

        <div className='anime-row'>
          <h2 className='text-heading'>Anime</h2>
          <div className='row'>
            <AnimeList animelist={animeData} setAnimeInfo={setAnimeInfo} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
