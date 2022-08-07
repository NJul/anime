import React from 'react';
import './AnimeInfo.css';

export const AnimeInfo = (props) => {
  console.log(props);
  const { title } = props.animeInfo;
  return (
    <div className='anime-content'>
      <h3>{title}</h3>
    </div>
  );
};
