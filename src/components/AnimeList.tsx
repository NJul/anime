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
  animeComponent: AnimeComponent,
  handleList,
}) => {
  if (animeList.length === 0) {
    return <p className='not-found'>Not Found</p>;
  }

  return (
    <>
      {animeList.map(anime => {
        const imageUrl =
          anime.images?.jpg?.large_image_url ??
          anime.images?.jpg?.image_url ??
          anime.images?.jpg?.small_image_url ??
          '';

        const japaneseTitle = anime.title_japanese ?? anime.title;
        const synopsis = anime.synopsis ?? 'No synopsis available.';

        return (
          <div
            className='card'
            key={anime.mal_id}
            onClick={() => setAnimeInfo(anime)}
          >
            <img src={imageUrl} alt={`${anime.title} Image`} loading='lazy' />

            <div className='anime-info'>
              <h4>{anime.title}</h4>

              <div
                className='overlay'
                onClick={e => {
                  e.stopPropagation();
                  handleList(anime);
                }}
              >
                <h4 className='title-overlay'>{japaneseTitle}</h4>

                <h3 className='title-overlay'>SYNOPSIS</h3>

                <div className='synopsis'>
                  <p>{synopsis}</p>
                </div>

                <AnimeComponent />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
