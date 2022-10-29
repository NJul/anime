import React from 'react';
import './AnimeList.css';

export const AnimeList = ({
  animeList,
  setAnimeInfo,
  animeComponent,
  handleList,
}) => {
  const AddToList = animeComponent;

  return (
    <>
      {animeList
        ? animeList.map((anime, index) => {
            return (
              <div
                className='card'
                key={index}
                onClick={() => setAnimeInfo(anime)}
              >
                <img src={anime.images.jpg.large_image_url} alt='animeImage' />
                <div className='anime-info'>
                  <h4>{anime.title}</h4>
                  <div className='overlay' onClick={() => handleList(anime)}>
                    <h4 className='title-overlay'>{anime.title_japanese}</h4>
                    <h3 className='title-overlay'>SYNOPSIS</h3>
                    <div className='synopsis'>
                      <p>{anime.synopsis}</p>
                    </div>
                    <AddToList />
                  </div>
                </div>
              </div>
            );
          })
        : 'Not Found'}
    </>
  );
};
