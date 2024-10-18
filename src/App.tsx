import { useState } from 'react';
import { AnimeList } from './components/AnimeList';
import { AnimeInfo } from './components/AnimeInfo';
import { AddToList } from './components/AddToList';
import { RemoveFromList } from './components/RemoveFromList';
import { SearchBox } from './components/SearchBox';
import { useFetchAnime, useLocalStorage } from './hooks/hooks';
import { Anime } from './types/animeTypes';
import './App.css';

const App: React.FC = () => {
  const [search, setSearch] = useState<string>('fairy');
  const [myAnimeList, setMyAnimeList] = useLocalStorage<Anime[]>(
    'myAnimeList',
    []
  );
  const [animeInfo, setAnimeInfo] = useState<Anime | null>(null);

  const { animeData, loading, error } = useFetchAnime(search);

  const addTo = (anime: Anime) => {
    if (!myAnimeList.some(myAnime => myAnime.mal_id === anime.mal_id)) {
      setMyAnimeList(prevList => [...prevList, anime]);
    }
  };

  const removeFrom = (anime: Anime) => {
    setMyAnimeList(prevList =>
      prevList.filter(myAnime => myAnime.mal_id !== anime.mal_id)
    );
  };

  return (
    <>
      <div className='header'>
        <h1>My Anime List</h1>
        <SearchBox setSearch={setSearch} />
      </div>

      <div className='container'>
        <div className='animeInfo'>
          {animeInfo && <AnimeInfo animeInfo={animeInfo} />}
        </div>

        <div className='anime-row'>
          <h2 className='text-heading'>Anime</h2>
          <div className='row'>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <AnimeList
                animeList={animeData}
                setAnimeInfo={setAnimeInfo}
                animeComponent={AddToList}
                handleList={addTo}
              />
            )}
          </div>

          <h2 className='text-heading'>My List</h2>
          <div className='row'>
            <AnimeList
              animeList={myAnimeList}
              setAnimeInfo={setAnimeInfo}
              animeComponent={RemoveFromList}
              handleList={removeFrom}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
