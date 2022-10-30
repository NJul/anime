import React from 'react';
import './AnimeInfo.css';

export const AnimeInfo = (props) => {
  const {
    title,
    images: {
      jpg: { large_image_url },
    },
    source,
    score,
    rank,
    popularity,
    members,
    status,
    duration,
    rating,
  } = props.animeInfo;
  return (
    <div className='anime-content'>
      <h3>{title}</h3>
      {<img src={large_image_url} alt='animeImage' />}
      <div className='info'>
        {rank && (
          <h3>
            <span className='text-color'>Rank:</span> {rank}
          </h3>
        )}
        {rating && (
          <h3>
            <span className='text-color'>Rating:</span> {rating}
          </h3>
        )}
        {popularity && (
          <h3>
            <span className='text-color'>Popularity:</span> {popularity}
          </h3>
        )}
        <br />
        <hr />
        <br />
        {members && (
          <h4>
            <span className='text-color'>Members:</span> {members}
          </h4>
        )}
        {source && (
          <h4>
            <span className='text-color'>Source:</span> {source}
          </h4>
        )}
        {duration && (
          <h4>
            <span className='text-color'>Duration:</span> {duration}
          </h4>
        )}
        {status && (
          <h4>
            <span className='text-color'>Status:</span> {status}
          </h4>
        )}
        {score && (
          <h4>
            <span className='text-color'>Score:</span> {score}
          </h4>
        )}
      </div>
    </div>
  );
};
