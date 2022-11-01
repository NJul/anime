import { useEffect, useState } from 'react';
import { AnimeList } from './components/AnimeList';
import { AnimeInfo } from './components/AnimeInfo';
import { AddToList } from './components/AddToList';
import { RemoveFromList } from './components/RemoveFromList';
import './App.css';

function App() {
  const loadedMyAnimeList = localStorage.getItem('myAnimeList')
    ? JSON.parse(localStorage.getItem('myAnimeList')!)
    : [];

  const [search, setSearch] = useState('fairy');
  const [animeData, setAnimeData] = useState();
  const [animeInfo, setAnimeInfo] = useState();
  const [myAnimeList, setMyAnimeList] = useState(loadedMyAnimeList);

  const addTo = (anime) => {
    const index = myAnimeList.findIndex((myAnime) => {
      return myAnime.mal_id === anime.mal_id;
    });

    if (index < 0) {
      const newArray = [...myAnimeList, anime];
      setMyAnimeList(newArray);
    }
  };

  const removeFrom = (anime) => {
    const newArray = myAnimeList.filter((myAnime) => {
      return myAnime.mal_id !== anime.mal_id;
    });
    setMyAnimeList(newArray);
  };

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

  useEffect(() => {
    const json = JSON.stringify(myAnimeList);
    window.localStorage.setItem('myAnimeList', json);
  }, [myAnimeList]);

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
            <AnimeList
              animeList={animeData}
              setAnimeInfo={setAnimeInfo}
              animeComponent={AddToList}
              handleList={(anime) => addTo(anime)}
            />
          </div>

          <h2 className='text-heading'>My List</h2>
          <div className='row'>
            <AnimeList
              animeList={myAnimeList}
              setAnimeInfo={setAnimeInfo}
              animeComponent={RemoveFromList}
              handleList={(anime) => removeFrom(anime)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
