import { Anime } from '../types/animeTypes';
import './AnimeList.css';

interface AnimeListProps {
  animeList: Anime[];
  setAnimeInfo: (anime: Anime) => void;
  animeComponent: React.FC;
  handleList: (anime: Anime) => void;
}

export const AnimeList: React.FC<AnimeListProps> = ({
  animeList,
  setAnimeInfo,
  animeComponent: AddToList,
  handleList,
}) => {
  return (
    <>
      {animeList.length > 0
        ? animeList.map(anime => (
            <div
              className='card'
              key={anime.mal_id}
              onClick={() => setAnimeInfo(anime)}>
              <img
                src={anime.images.jpg.large_image_url}
                alt={`${anime.title} Image`}
              />
              <div className='anime-info'>
                <h4>{anime.title}</h4>
                <div
                  className='overlay'
                  onClick={e => {
                    e.stopPropagation();
                    handleList(anime);
                  }}>
                  <h4 className='title-overlay'>{anime.title_japanese}</h4>
                  <h3 className='title-overlay'>SYNOPSIS</h3>
                  <div className='synopsis'>
                    <p>{anime.synopsis}</p>
                  </div>
                  <AddToList />
                </div>
              </div>
            </div>
          ))
        : 'Not Found'}
    </>
  );
};
