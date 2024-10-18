export interface Anime {
  mal_id: number;
  title: string;
  title_japanese: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  synopsis: string;
  source: string;
  score: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  status: string | null;
  duration: string | null;
  rating: string | null;
}
