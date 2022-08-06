import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [search, setSearch] = useState('fairy');
  const [animeData, setAnimeData] = useState();

  const getData = async () => {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${search}&limit=10`
    );
    const resData = await res.json();
    // console.log(resData.data);
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
    </>
  );
}

export default App;
