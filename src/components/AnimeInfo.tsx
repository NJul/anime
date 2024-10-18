import { Anime } from '../types/animeTypes';
import './AnimeInfo.css';

interface AnimeInfoProps {
  animeInfo: Anime;
}

const InfoItem: React.FC<{ label: string; value: number | string | null }> = ({
  label,
  value,
}) =>
  value != null ? (
    <h4>
      <span className='text-color'>{label}:</span> {value}
    </h4>
  ) : null;

export const AnimeInfo: React.FC<AnimeInfoProps> = ({ animeInfo }) => {
  const {
    title,
    images,
    source,
    score,
    rank,
    popularity,
    members,
    status,
    duration,
    rating,
  } = animeInfo;
  const largeImageUrl = images.jpg.large_image_url;

  return (
    <div className='anime-content'>
      <h3>{title}</h3>
      <img src={largeImageUrl} alt={`${title} Image`} />
      <div className='info'>
        <InfoItem label='Rank' value={rank} />
        <InfoItem label='Rating' value={rating} />
        <InfoItem label='Popularity' value={popularity} />
        <br />
        <hr />
        <br />
        <InfoItem label='Members' value={members} />
        <InfoItem label='Source' value={source} />
        <InfoItem label='Duration' value={duration} />
        <InfoItem label='Status' value={status} />
        <InfoItem label='Score' value={score} />
      </div>
    </div>
  );
};
