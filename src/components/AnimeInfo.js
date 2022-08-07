import React from 'react';
import './AnimeInfo.css';

export const AnimeInfo = (props) => {
  console.log(props);
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
      <br />
      {<img src={large_image_url} alt='animeImage' />}
      <br />
      <div className='info'>
        <h3>
          <span className='text-color'>Rank:</span> {rank}
        </h3>
        <h3>
          <span className='text-color'>Rating:</span> {rating}
        </h3>
        <h3>
          <span className='text-color'>Popularity:</span> {popularity}
        </h3>
        <br />
        <hr />
        <br />
        <h4>
          <span className='text-color'>Members:</span> {members}
        </h4>
        <h4>
          <span className='text-color'>Source:</span> {source}
        </h4>
        <h4>
          <span className='text-color'>Duration:</span> {duration}
        </h4>
        <h4>
          <span className='text-color'>Status:</span> {status}
        </h4>
        <h4>
          <span className='text-color'>Score:</span> {score}
        </h4>
      </div>
    </div>
  );
};
